package com.lakucha.order;

import com.lakucha.auth.UserPrincipal;
import com.lakucha.order.dto.CheckoutRequest;
import com.lakucha.order.dto.OrderResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse checkout(@AuthenticationPrincipal UserPrincipal user, @Valid @RequestBody CheckoutRequest request) {
        return OrderResponse.from(orderService.checkout(user.getId(), request));
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<OrderResponse> getMine(@AuthenticationPrincipal UserPrincipal user) {
        // Keeps the session open through OrderResponse.from(), which touches
        // the lazy Order.items association (open-in-view is disabled).
        return orderService.findForUser(user.getId()).stream().map(OrderResponse::from).toList();
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public OrderResponse getById(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal user) {
        return OrderResponse.from(orderService.findByIdForPrincipal(id, user));
    }
}
