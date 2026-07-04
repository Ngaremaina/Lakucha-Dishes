package com.lakucha.catalog.dto;

import com.lakucha.catalog.Product;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        Long categoryId,
        String categoryName,
        String name,
        BigDecimal price,
        String image,
        Integer quantity,
        String description,
        double averageRating,
        long ratingCount
) {
    public static ProductResponse from(Product product, double averageRating, long ratingCount) {
        return new ProductResponse(
                product.getId(),
                product.getCategory() != null ? product.getCategory().getId() : null,
                product.getCategory() != null ? product.getCategory().getName() : null,
                product.getName(),
                product.getPrice(),
                product.getImage(),
                product.getQuantity(),
                product.getDescription(),
                averageRating,
                ratingCount
        );
    }
}
