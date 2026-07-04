package com.lakucha.auth.dto;

import com.lakucha.auth.Role;
import com.lakucha.auth.User;

public record UserSummary(Long id, String username, String email, Role role) {
    public static UserSummary from(User user) {
        return new UserSummary(user.getId(), user.getUsername(), user.getEmail(), user.getRole());
    }
}
