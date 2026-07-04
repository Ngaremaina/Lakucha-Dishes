package com.lakucha.catalog.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record ProductRequest(
        Long categoryId,
        @NotBlank String name,
        @NotNull @DecimalMin(value = "0.0", inclusive = true) BigDecimal price,
        String image,
        @NotNull @PositiveOrZero Integer quantity,
        String description
) {
}
