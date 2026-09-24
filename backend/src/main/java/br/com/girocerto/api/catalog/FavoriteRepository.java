package br.com.girocerto.api.catalog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findAllByUser_IdOrderByCreatedAtDesc(Long userId);
    Optional<Favorite> findByUser_IdAndMotorcycle_Id(Long userId, Long motorcycleId);
}
