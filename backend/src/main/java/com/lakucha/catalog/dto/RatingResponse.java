package com.lakucha.catalog.dto;

import com.lakucha.catalog.Rating;

import java.time.Instant;

public record RatingResponse(
        Long id,
        Long productId,
        Long userId,
        Integer score,
        String comment,
        Instant createdAt
) {
    public static RatingResponse from(Rating rating) {
        return new RatingResponse(rating.getId(), rating.getProductId(), rating.getUserId(),
                rating.getScore(), rating.getComment(), rating.getCreatedAt());
    }
}
