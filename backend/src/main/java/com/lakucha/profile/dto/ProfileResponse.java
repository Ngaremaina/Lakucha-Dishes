package com.lakucha.profile.dto;

import com.lakucha.profile.Profile;

public record ProfileResponse(Long id, Long userId, String firstname, String lastname, String phone, String imageUrl) {
    public static ProfileResponse from(Profile profile) {
        return new ProfileResponse(profile.getId(), profile.getUserId(), profile.getFirstname(),
                profile.getLastname(), profile.getPhone(), profile.getImageUrl());
    }
}
