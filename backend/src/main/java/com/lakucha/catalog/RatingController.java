package com.lakucha.catalog;

import com.lakucha.auth.UserPrincipal;
import com.lakucha.catalog.dto.RatingRequest;
import com.lakucha.catalog.dto.RatingResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products/{productId}/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @GetMapping
    public List<RatingResponse> getForProduct(@PathVariable Long productId) {
        return ratingService.findForProduct(productId).stream().map(RatingResponse::from).toList();
    }

    @PostMapping
    public RatingResponse upsert(@PathVariable Long productId,
                                  @AuthenticationPrincipal UserPrincipal user,
                                  @Valid @RequestBody RatingRequest request) {
        return RatingResponse.from(ratingService.upsert(productId, user.getId(), request));
    }
}
