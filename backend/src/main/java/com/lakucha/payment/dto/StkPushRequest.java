package com.lakucha.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record StkPushRequest(
        @NotNull Long orderId,
        @NotBlank @Pattern(regexp = "^2547\\d{8}$|^2541\\d{8}$", message = "Phone number must be in the format 2547XXXXXXXX")
        String phoneNumber
) {
}
