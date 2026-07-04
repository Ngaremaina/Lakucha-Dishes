package com.lakucha.catalog;

import com.lakucha.catalog.dto.ProductRequest;
import com.lakucha.common.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public Page<Product> findAll(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product " + id + " not found"));
    }

    @Transactional
    public Product create(ProductRequest request) {
        Product product = Product.builder()
                .category(resolveCategory(request.categoryId()))
                .name(request.name())
                .price(request.price())
                .image(request.image())
                .quantity(request.quantity())
                .description(request.description())
                .build();
        return productRepository.save(product);
    }

    @Transactional
    public Product update(Long id, ProductRequest request) {
        Product product = findById(id);
        product.setCategory(resolveCategory(request.categoryId()));
        product.setName(request.name());
        product.setPrice(request.price());
        product.setImage(request.image());
        product.setQuantity(request.quantity());
        product.setDescription(request.description());
        return productRepository.save(product);
    }

    @Transactional
    public void delete(Long id) {
        Product product = findById(id);
        productRepository.delete(product);
    }

    private Category resolveCategory(Long categoryId) {
        if (categoryId == null) {
            return null;
        }
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category " + categoryId + " not found"));
    }
}
