package com.lakucha.catalog;

import com.lakucha.catalog.dto.ProductRequest;
import com.lakucha.catalog.dto.ProductResponse;
import com.lakucha.common.PageResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;
    private final RatingRepository ratingRepository;

    public ProductController(ProductService productService, RatingRepository ratingRepository) {
        this.productService = productService;
        this.ratingRepository = ratingRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> getAll(@PageableDefault(size = 20) Pageable pageable) {
        // @Transactional keeps the Hibernate session open through toResponse(),
        // which touches the lazy Product.category association — open-in-view is
        // deliberately disabled, so without this the mapping throws
        // LazyInitializationException after the repository call returns.
        Page<ProductResponse> page = productService.findAll(pageable).map(this::toResponse);
        return PageResponse.from(page);
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ProductResponse getById(@PathVariable Long id) {
        return toResponse(productService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse create(@Valid @RequestBody ProductRequest request) {
        return toResponse(productService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ProductResponse update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return toResponse(productService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }

    private ProductResponse toResponse(Product product) {
        double avg = ratingRepository.averageScoreForProduct(product.getId());
        long count = ratingRepository.countByProductId(product.getId());
        return ProductResponse.from(product, avg, count);
    }
}
