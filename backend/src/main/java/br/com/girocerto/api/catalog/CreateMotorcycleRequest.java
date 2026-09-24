package br.com.girocerto.api.catalog;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreateMotorcycleRequest(
        @NotBlank @Size(max = 80) String brand,
        @NotBlank @Size(max = 100) String model,
        @Size(max = 120) String version,
        @NotNull @Min(1950) @Max(2100) Integer year,
        @NotNull @Min(0) Integer mileage,
        @NotNull @Min(50) @Max(3000) Integer displacementCc,
        @NotNull @DecimalMin("1.00") BigDecimal price,
        @NotBlank @Size(max = 24) String category,
        @NotBlank @Size(max = 80) String city,
        @NotBlank @Size(min = 2, max = 2) String state,
        @NotBlank @Size(max = 1200) String description,
        @Size(max = 500) String imageUrl
) {
}
