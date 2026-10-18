package com.lakucha.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class RefreshTokenCookieFactory {

    public static final String COOKIE_NAME = "refresh_token";

    private final boolean secure;
    private final String sameSite;
    private final String cookiePath;
    private final RefreshTokenService refreshTokenService;

    public RefreshTokenCookieFactory(@Value("${app.cookie.secure}") boolean secure,
                                      @Value("${app.cookie.same-site}") String sameSite,
                                      @Value("${server.servlet.context-path:}") String contextPath,
                                      RefreshTokenService refreshTokenService) {
        this.secure = secure;
        this.sameSite = sameSite;
        // The browser sees the context path (e.g. /api on Vercel), so the cookie must include it.
        this.cookiePath = contextPath + "/auth";
        this.refreshTokenService = refreshTokenService;
    }

    public ResponseCookie create(String rawToken) {
        return ResponseCookie.from(COOKIE_NAME, rawToken)
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path(cookiePath)
                .maxAge(refreshTokenService.getTtlSeconds())
                .build();
    }

    public ResponseCookie clear() {
        return ResponseCookie.from(COOKIE_NAME, "")
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path(cookiePath)
                .maxAge(0)
                .build();
    }
}
