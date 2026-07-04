package com.lakucha.contact.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ContactRequest(
        @NotBlank String name,
        @NotBlank @Email String email,
        @NotBlank String message
) {
}
