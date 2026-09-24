package br.com.girocerto.api.catalog;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record MotorcycleResponse(
        Long id,
        String brand,
        String model,
        String version,
        Integer year,
        Integer mileage,
        Integer displacementCc,
        BigDecimal price,
        String category,
        String city,
        String state,
        String sellerType,
        String sellerName,
        boolean verifiedSeller,
        String description,
        String imageUrl,
        List<String> imageUrls,
        Instant createdAt
) {
    public static MotorcycleResponse from(Motorcycle motorcycle) {
        return new MotorcycleResponse(
                motorcycle.getId(),
                motorcycle.getBrand(),
                motorcycle.getModel(),
                motorcycle.getVersion(),
                motorcycle.getYear(),
                motorcycle.getMileage(),
                motorcycle.getDisplacementCc(),
                motorcycle.getPrice(),
                motorcycle.getCategory(),
                motorcycle.getCity(),
                motorcycle.getState(),
                motorcycle.getSellerType(),
                motorcycle.getSellerName(),
                motorcycle.isVerifiedSeller(),
                motorcycle.getDescription(),
                motorcycle.getImageUrl(),
                motorcycle.getImageUrls().isEmpty()
                        ? List.of(motorcycle.getImageUrl())
                        : motorcycle.getImageUrls(),
                motorcycle.getCreatedAt()
        );
    }
}
