package com.lakucha.shipping.dto;

import jakarta.validation.constraints.NotBlank;

public record ShippingRequest(
        @NotBlank String firstname,
        @NotBlank String lastname,
        @NotBlank String region,
        @NotBlank String address,
        @NotBlank String city
) {
}
