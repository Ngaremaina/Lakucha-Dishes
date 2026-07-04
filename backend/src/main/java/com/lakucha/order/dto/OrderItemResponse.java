package com.lakucha.order.dto;

import com.lakucha.order.OrderItem;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        Long productId,
        String productName,
        BigDecimal unitPrice,
        Integer quantity,
        BigDecimal lineTotal
) {
    public static OrderItemResponse from(OrderItem item) {
        return new OrderItemResponse(item.getId(), item.getProductId(), item.getProductNameSnapshot(),
                item.getUnitPriceSnapshot(), item.getQuantity(), item.getLineTotal());
    }
}
