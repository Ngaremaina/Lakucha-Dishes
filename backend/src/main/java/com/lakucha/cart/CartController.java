package com.lakucha.cart;

import com.lakucha.auth.UserPrincipal;
import com.lakucha.cart.dto.CartItemRequest;
import com.lakucha.cart.dto.CartItemResponse;
import com.lakucha.cart.dto.UpdateQuantityRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<CartItemResponse> getMyCart(@AuthenticationPrincipal UserPrincipal user) {
        // Keeps the session open through CartItemResponse.from(), which touches
        // the lazy CartItem.product association (open-in-view is disabled).
        return cartService.findForUser(user.getId()).stream().map(CartItemResponse::from).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CartItemResponse add(@AuthenticationPrincipal UserPrincipal user, @Valid @RequestBody CartItemRequest request) {
        return CartItemResponse.from(cartService.addOrIncrement(user.getId(), request));
    }

    @PatchMapping("/{id}")
    @Transactional
    public CartItemResponse updateQuantity(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal user,
                                            @Valid @RequestBody UpdateQuantityRequest request) {
        return CartItemResponse.from(cartService.updateQuantity(id, user, request.quantity()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal user) {
        cartService.delete(id, user);
    }
}
