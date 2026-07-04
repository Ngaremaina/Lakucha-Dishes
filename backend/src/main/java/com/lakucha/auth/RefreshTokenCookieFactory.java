package com.lakucha.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class RefreshTokenCookieFactory {

    public static final String COOKIE_NAME = "refresh_token";
    private static final String COOKIE_PATH = "/auth";

    private final boolean secure;
    private final String sameSite;
    private final RefreshTokenService refreshTokenService;

    public RefreshTokenCookieFactory(@Value("${app.cookie.secure}") boolean secure,
                                      @Value("${app.cookie.same-site}") String sameSite,
                                      RefreshTokenService refreshTokenService) {
        this.secure = secure;
        this.sameSite = sameSite;
        this.refreshTokenService = refreshTokenService;
    }

    public ResponseCookie create(String rawToken) {
        return ResponseCookie.from(COOKIE_NAME, rawToken)
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path(COOKIE_PATH)
                .maxAge(refreshTokenService.getTtlSeconds())
                .build();
    }

    public ResponseCookie clear() {
        return ResponseCookie.from(COOKIE_NAME, "")
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path(COOKIE_PATH)
                .maxAge(0)
                .build();
    }
}
