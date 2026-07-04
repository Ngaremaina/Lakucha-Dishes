package com.lakucha.catalog;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

// Active only under the "e2e" profile (see application-e2e.yml). The Playwright smoke test
// needs at least one product to browse/add-to-cart/checkout; idempotent (checked by name) so
// re-running the app against the same database doesn't create duplicates.
@Component
@Profile("e2e")
public class E2eDataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public E2eDataSeeder(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        Category category = categoryRepository.findByName("E2E Category")
                .orElseGet(() -> categoryRepository.save(Category.builder().name("E2E Category").build()));

        boolean productExists = productRepository.findAll().stream()
                .anyMatch(p -> "E2E Product".equals(p.getName()));
        if (!productExists) {
            productRepository.save(Product.builder()
                    .category(category)
                    .name("E2E Product")
                    .price(new BigDecimal("100.00"))
                    .image("https://placehold.co/400x300")
                    .quantity(100)
                    .description("Seeded product for the Playwright smoke test")
                    .build());
        }
    }
}
