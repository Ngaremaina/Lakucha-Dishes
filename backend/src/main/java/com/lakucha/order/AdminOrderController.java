package com.lakucha.order;

import com.lakucha.common.PageResponse;
import com.lakucha.order.dto.OrderResponse;
import com.lakucha.order.dto.UpdateOrderStatusRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getAll(@RequestParam(required = false) OrderStatus status,
                                               @PageableDefault(size = 20) Pageable pageable) {
        // Keeps the session open through OrderResponse.from(), which touches
        // the lazy Order.items association (open-in-view is disabled).
        Page<OrderResponse> page = orderService.findAllForAdmin(status, pageable).map(OrderResponse::from);
        return PageResponse.from(page);
    }

    @PatchMapping("/{id}/status")
    @Transactional
    public OrderResponse updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateOrderStatusRequest request) {
        return OrderResponse.from(orderService.updateStatus(id, request.status()));
    }
}
