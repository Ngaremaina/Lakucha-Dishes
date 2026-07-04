package com.lakucha.common;

import com.lakucha.auth.Role;
import com.lakucha.auth.UserPrincipal;

/** Centralizes the "own resource or admin" check the old Flask app never did (IDOR). */
public final class OwnershipGuard {

    private OwnershipGuard() {
    }

    public static void requireOwnerOrAdmin(Long resourceOwnerId, UserPrincipal principal) {
        boolean isOwner = principal.getId().equals(resourceOwnerId);
        boolean isAdmin = principal.getRole() == Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new ForbiddenException("You do not have access to this resource");
        }
    }
}
