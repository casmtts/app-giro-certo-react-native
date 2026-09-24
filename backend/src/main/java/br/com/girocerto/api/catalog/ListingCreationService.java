package br.com.girocerto.api.catalog;

import br.com.girocerto.api.auth.AppUserRepository;
import br.com.girocerto.api.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Locale;

@Service
public class ListingCreationService {
    private static final String DEFAULT_IMAGE =
            "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=85";

    private final MotorcycleRepository motorcycles;
    private final AppUserRepository users;
    private final PhotoStorageService photoStorage;

    public ListingCreationService(MotorcycleRepository motorcycles, AppUserRepository users, PhotoStorageService photoStorage) {
        this.motorcycles = motorcycles;
        this.users = users;
        this.photoStorage = photoStorage;
    }

    @Transactional
    public MotorcycleResponse create(Long userId, CreateMotorcycleRequest request) {
        return create(userId, request, List.of());
    }

    @Transactional
    public MotorcycleResponse create(Long userId, CreateMotorcycleRequest request, List<MultipartFile> photos) {
        var user = users.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Conta não encontrada."));
        List<String> storedPhotos = photoStorage.store(photos);
        String imageUrl = !storedPhotos.isEmpty()
                ? storedPhotos.get(0)
                : request.imageUrl() == null || request.imageUrl().isBlank()
                ? DEFAULT_IMAGE
                : request.imageUrl().trim();
        Motorcycle motorcycle = new Motorcycle(
                request.brand().trim(),
                request.model().trim(),
                request.version() == null ? "" : request.version().trim(),
                request.year(),
                request.mileage(),
                request.displacementCc(),
                request.price(),
                request.category().trim().toUpperCase(Locale.ROOT),
                request.city().trim(),
                request.state().trim().toUpperCase(Locale.ROOT),
                "PRIVATE",
                user.getName(),
                false,
                request.description().trim(),
                imageUrl,
                storedPhotos
        );
        return MotorcycleResponse.from(motorcycles.save(motorcycle));
    }
}
