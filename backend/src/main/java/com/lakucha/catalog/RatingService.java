package com.lakucha.catalog;

import com.lakucha.catalog.dto.RatingRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private final ProductService productService;

    public RatingService(RatingRepository ratingRepository, ProductService productService) {
        this.ratingRepository = ratingRepository;
        this.productService = productService;
    }

    public List<Rating> findForProduct(Long productId) {
        return ratingRepository.findByProductId(productId);
    }

    @Transactional
    public Rating upsert(Long productId, Long userId, RatingRequest request) {
        productService.findById(productId); // 404 if product doesn't exist
        Rating rating = ratingRepository.findByProductIdAndUserId(productId, userId)
                .orElseGet(() -> Rating.builder().productId(productId).userId(userId).build());
        rating.setScore(request.score());
        rating.setComment(request.comment());
        return ratingRepository.save(rating);
    }
}
