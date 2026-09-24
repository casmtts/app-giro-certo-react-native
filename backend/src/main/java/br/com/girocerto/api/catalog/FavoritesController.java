package br.com.girocerto.api.catalog;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoritesController {
    private final FavoritesService favoritesService;

    public FavoritesController(FavoritesService favoritesService) {
        this.favoritesService = favoritesService;
    }

    @GetMapping
    List<MotorcycleResponse> list(@AuthenticationPrincipal Long userId) {
        return favoritesService.list(userId);
    }

    @PostMapping("/{motorcycleId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void add(@AuthenticationPrincipal Long userId, @PathVariable Long motorcycleId) {
        favoritesService.add(userId, motorcycleId);
    }

    @DeleteMapping("/{motorcycleId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void remove(@AuthenticationPrincipal Long userId, @PathVariable Long motorcycleId) {
        favoritesService.remove(userId, motorcycleId);
    }
}
