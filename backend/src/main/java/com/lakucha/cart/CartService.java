package com.lakucha.cart;

import com.lakucha.auth.UserPrincipal;
import com.lakucha.catalog.Product;
import com.lakucha.catalog.ProductService;
import com.lakucha.cart.dto.CartItemRequest;
import com.lakucha.common.OwnershipGuard;
import com.lakucha.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductService productService;

    public CartService(CartItemRepository cartItemRepository, ProductService productService) {
        this.cartItemRepository = cartItemRepository;
        this.productService = productService;
    }

    public List<CartItem> findForUser(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    @Transactional
    public CartItem addOrIncrement(Long userId, CartItemRequest request) {
        Product product = productService.findById(request.productId());
        CartItem item = cartItemRepository.findByUserIdAndProductId(userId, product.getId())
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + request.quantity());
                    return existing;
                })
                .orElseGet(() -> CartItem.builder()
                        .userId(userId)
                        .product(product)
                        .quantity(request.quantity())
                        .build());
        return cartItemRepository.save(item);
    }

    @Transactional
    public CartItem updateQuantity(Long id, UserPrincipal principal, int quantity) {
        CartItem item = findByIdForPrincipal(id, principal);
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    @Transactional
    public void delete(Long id, UserPrincipal principal) {
        CartItem item = findByIdForPrincipal(id, principal);
        cartItemRepository.delete(item);
    }

    CartItem findByIdForPrincipal(Long id, UserPrincipal principal) {
        CartItem item = cartItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item " + id + " not found"));
        OwnershipGuard.requireOwnerOrAdmin(item.getUserId(), principal);
        return item;
    }
}
