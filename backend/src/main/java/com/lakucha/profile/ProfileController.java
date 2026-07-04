package com.lakucha.profile;

import com.lakucha.auth.UserPrincipal;
import com.lakucha.profile.dto.ProfileRequest;
import com.lakucha.profile.dto.ProfileResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ProfileResponse getMine(@AuthenticationPrincipal UserPrincipal user) {
        return ProfileResponse.from(profileService.findOrCreate(user.getId()));
    }

    @PutMapping("/me")
    public ProfileResponse updateMine(@AuthenticationPrincipal UserPrincipal user, @Valid @RequestBody ProfileRequest request) {
        return ProfileResponse.from(profileService.update(user.getId(), request));
    }
}
