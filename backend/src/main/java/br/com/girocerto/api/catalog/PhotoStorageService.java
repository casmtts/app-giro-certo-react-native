package br.com.girocerto.api.catalog;

import br.com.girocerto.api.common.BadRequestException;
import br.com.girocerto.api.common.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class PhotoStorageService {
    public static final int MAX_PHOTOS = 5;
    private static final long MAX_FILE_BYTES = 10L * 1024 * 1024;
    private static final Pattern SAFE_NAME = Pattern.compile("^[0-9a-f-]{36}\\.(jpg|png|webp)$");

    private final Path directory;

    public PhotoStorageService(@Value("${app.uploads.directory:./uploads}") String directory) {
        this.directory = Path.of(directory).toAbsolutePath().normalize();
    }

    public List<String> store(List<MultipartFile> uploads) {
        if (uploads == null || uploads.isEmpty()) {
            return List.of();
        }
        if (uploads.size() > MAX_PHOTOS) {
            throw new BadRequestException("Envie no máximo 5 fotos por anúncio.");
        }

        List<Path> saved = new ArrayList<>();
        List<String> urls = new ArrayList<>();
        try {
            Files.createDirectories(directory);
            for (MultipartFile upload : uploads) {
                if (upload == null || upload.isEmpty()) {
                    throw new BadRequestException("Uma das fotos está vazia.");
                }
                if (upload.getSize() > MAX_FILE_BYTES) {
                    throw new BadRequestException("Cada foto pode ter no máximo 10 MB.");
                }

                byte[] bytes = upload.getBytes();
                FileType type = detectType(bytes);
                String fileName = UUID.randomUUID() + type.extension();
                Path destination = directory.resolve(fileName).normalize();
                if (!destination.getParent().equals(directory)) {
                    throw new BadRequestException("Nome de arquivo inválido.");
                }
                Files.write(destination, bytes, StandardOpenOption.CREATE_NEW, StandardOpenOption.WRITE);
                saved.add(destination);
                urls.add("/api/uploads/" + fileName);
            }
            return List.copyOf(urls);
        } catch (BadRequestException exception) {
            deleteQuietly(saved);
            throw exception;
        } catch (IOException exception) {
            deleteQuietly(saved);
            throw new BadRequestException("Não foi possível armazenar as fotos. Tente novamente.");
        }
    }

    public Resource load(String fileName) {
        if (fileName == null || !SAFE_NAME.matcher(fileName).matches()) {
            throw new ResourceNotFoundException("Foto não encontrada.");
        }
        Path file = directory.resolve(fileName).normalize();
        if (!file.getParent().equals(directory) || !Files.isRegularFile(file)) {
            throw new ResourceNotFoundException("Foto não encontrada.");
        }
        return new FileSystemResource(file);
    }

    public MediaType mediaType(String fileName) {
        String lower = fileName.toLowerCase(Locale.ROOT);
        if (lower.endsWith(".png")) return MediaType.IMAGE_PNG;
        if (lower.endsWith(".webp")) return MediaType.parseMediaType("image/webp");
        return MediaType.IMAGE_JPEG;
    }

    private FileType detectType(byte[] bytes) {
        if (bytes.length >= 3 && (bytes[0] & 0xff) == 0xff && (bytes[1] & 0xff) == 0xd8 && (bytes[2] & 0xff) == 0xff) {
            return new FileType(".jpg");
        }
        if (bytes.length >= 8
                && (bytes[0] & 0xff) == 0x89 && bytes[1] == 'P' && bytes[2] == 'N' && bytes[3] == 'G'
                && (bytes[4] & 0xff) == 0x0d && (bytes[5] & 0xff) == 0x0a
                && (bytes[6] & 0xff) == 0x1a && (bytes[7] & 0xff) == 0x0a) {
            return new FileType(".png");
        }
        if (bytes.length >= 12 && bytes[0] == 'R' && bytes[1] == 'I' && bytes[2] == 'F' && bytes[3] == 'F'
                && bytes[8] == 'W' && bytes[9] == 'E' && bytes[10] == 'B' && bytes[11] == 'P') {
            return new FileType(".webp");
        }
        throw new BadRequestException("Envie fotos nos formatos JPG, PNG ou WebP.");
    }

    private void deleteQuietly(List<Path> files) {
        for (Path file : files) {
            try {
                Files.deleteIfExists(file);
            } catch (IOException ignored) {
                // Keep cleanup best-effort while preserving the original upload error.
            }
        }
    }

    private record FileType(String extension) { }
}
