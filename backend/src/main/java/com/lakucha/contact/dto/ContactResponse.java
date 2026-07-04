package com.lakucha.contact.dto;

import com.lakucha.contact.Contact;

import java.time.Instant;

public record ContactResponse(Long id, String name, String email, String message, Instant createdAt) {
    public static ContactResponse from(Contact contact) {
        return new ContactResponse(contact.getId(), contact.getName(), contact.getEmail(),
                contact.getMessage(), contact.getCreatedAt());
    }
}
