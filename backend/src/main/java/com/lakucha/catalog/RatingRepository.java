package com.lakucha.catalog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    Optional<Rating> findByProductIdAndUserId(Long productId, Long userId);

    List<Rating> findByProductId(Long productId);

    @Query("select coalesce(avg(r.score), 0) from Rating r where r.productId = :productId")
    double averageScoreForProduct(Long productId);

    long countByProductId(Long productId);
}
