package br.com.girocerto.api.catalog;

import br.com.girocerto.api.auth.AppUserRepository;
import br.com.girocerto.api.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoritesService {
    private final FavoriteRepository favorites;
    private final AppUserRepository users;
    private final MotorcycleRepository motorcycles;

    public FavoritesService(
            FavoriteRepository favorites,
            AppUserRepository users,
            MotorcycleRepository motorcycles
    ) {
        this.favorites = favorites;
        this.users = users;
        this.motorcycles = motorcycles;
    }

    @Transactional(readOnly = true)
    public List<MotorcycleResponse> list(Long userId) {
        return favorites.findAllByUser_IdOrderByCreatedAtDesc(userId).stream()
                .map(Favorite::getMotorcycle)
                .map(MotorcycleResponse::from)
                .toList();
    }

    @Transactional
    public void add(Long userId, Long motorcycleId) {
        if (favorites.findByUser_IdAndMotorcycle_Id(userId, motorcycleId).isPresent()) {
            return;
        }
        var user = users.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Conta não encontrada."));
        var motorcycle = motorcycles.findById(motorcycleId)
                .orElseThrow(() -> new ResourceNotFoundException("Anúncio não encontrado."));
        favorites.save(new Favorite(user, motorcycle));
    }

    @Transactional
    public void remove(Long userId, Long motorcycleId) {
        favorites.findByUser_IdAndMotorcycle_Id(userId, motorcycleId).ifPresent(favorites::delete);
    }
}
