package com.lakucha.order.dto;

import jakarta.validation.constraints.NotNull;

public record CheckoutRequest(@NotNull Long shippingId) {
}
