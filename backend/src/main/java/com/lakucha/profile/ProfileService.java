package com.lakucha.profile;

import com.lakucha.profile.dto.ProfileRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public Profile findOrCreate(Long userId) {
        return profileRepository.findByUserId(userId)
                .orElseGet(() -> profileRepository.save(Profile.builder().userId(userId).build()));
    }

    @Transactional
    public Profile update(Long userId, ProfileRequest request) {
        Profile profile = findOrCreate(userId);
        profile.setFirstname(request.firstname());
        profile.setLastname(request.lastname());
        profile.setPhone(request.phone());
        profile.setImageUrl(request.imageUrl());
        return profileRepository.save(profile);
    }
}
