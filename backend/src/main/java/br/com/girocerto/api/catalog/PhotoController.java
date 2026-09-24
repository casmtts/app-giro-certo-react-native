package br.com.girocerto.api.catalog;

import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/uploads")
public class PhotoController {
    private final PhotoStorageService photoStorage;

    public PhotoController(PhotoStorageService photoStorage) {
        this.photoStorage = photoStorage;
    }

    @GetMapping("/{fileName:.+}")
    ResponseEntity<Resource> get(@PathVariable String fileName) {
        return ResponseEntity.ok()
                .contentType(photoStorage.mediaType(fileName))
                .cacheControl(CacheControl.maxAge(7, TimeUnit.DAYS).cachePublic())
                .header("X-Content-Type-Options", "nosniff")
                .body(photoStorage.load(fileName));
    }
}
