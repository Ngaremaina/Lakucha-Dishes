package com.lakucha.cart.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UpdateQuantityRequest(@NotNull @Positive Integer quantity) {
}
