package com.lakucha.auth;

import com.lakucha.AbstractIntegrationTest;
import com.lakucha.auth.dto.LoginRequest;
import com.lakucha.auth.dto.RegisterRequest;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AuthControllerIT extends AbstractIntegrationTest {

    // Goes through GET /auth/csrf like the SPA does. Spring Security's csrf() post-processor
    // can't be used here: it permanently swaps the shared context's CsrfFilter repository for a
    // session-based one, which breaks the cookie-repository assertions in later tests.
    private MockHttpServletRequestBuilder csrfPost(String url) throws Exception {
        MvcResult csrfResult = mockMvc.perform(get("/auth/csrf")).andReturn();
        String token = objectMapper.readTree(csrfResult.getResponse().getContentAsString()).get("token").asText();
        return post(url)
                .cookie(csrfResult.getResponse().getCookie("XSRF-TOKEN"))
                .header("X-XSRF-TOKEN", token);
    }

    @Test
    void registerCreatesUserAndIssuesTokens() throws Exception {
        String body = objectMapper.writeValueAsString(new RegisterRequest("alice", "alice@example.com", "password123"));

        mockMvc.perform(post("/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value("alice@example.com"))
                .andExpect(jsonPath("$.user.role").value("CUSTOMER"))
                .andExpect(cookie().exists(RefreshTokenCookieFactory.COOKIE_NAME))
                .andExpect(cookie().httpOnly(RefreshTokenCookieFactory.COOKIE_NAME, true));
    }

    @Test
    void registerRejectsAttemptToSelfAssignRole() throws Exception {
        // RegisterRequest has no role field at all — this proves the API surface
        // can't be used to self-assign ADMIN the way the old Flask app allowed.
        AuthedUser user = registerAndLogin("mallory", "mallory@example.com", "password123");
        assertThat(userRepository.findById(user.id()).orElseThrow().getRole()).isEqualTo(Role.CUSTOMER);
    }

    @Test
    void registerDuplicateEmailIsRejected() throws Exception {
        registerAndLogin("bob", "bob@example.com", "password123");

        String body = objectMapper.writeValueAsString(new RegisterRequest("bob2", "bob@example.com", "password456"));
        mockMvc.perform(post("/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isConflict());
    }

    @Test
    void loginSucceedsWithCorrectCredentials() throws Exception {
        registerAndLogin("carol", "carol@example.com", "password123");

        String body = objectMapper.writeValueAsString(new LoginRequest("carol@example.com", "password123"));
        mockMvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty());
    }

    @Test
    void loginFailsWithWrongPassword() throws Exception {
        registerAndLogin("dave", "dave@example.com", "password123");

        String body = objectMapper.writeValueAsString(new LoginRequest("dave@example.com", "wrong-password"));
        mockMvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void refreshRotatesTokenAndInvalidatesThePreviousOne() throws Exception {
        AuthedUser user = registerAndLogin("erin", "erin@example.com", "password123");

        MvcResult refreshResult = mockMvc.perform(csrfPost("/auth/refresh")
                        .cookie(new Cookie(RefreshTokenCookieFactory.COOKIE_NAME, user.refreshCookieValue())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(cookie().exists(RefreshTokenCookieFactory.COOKIE_NAME))
                .andReturn();

        String newCookieValue = refreshResult.getResponse().getCookie(RefreshTokenCookieFactory.COOKIE_NAME).getValue();
        assertThat(newCookieValue).isNotEqualTo(user.refreshCookieValue());

        // The rotated-out (old) refresh token must no longer work.
        mockMvc.perform(csrfPost("/auth/refresh")
                        .cookie(new Cookie(RefreshTokenCookieFactory.COOKIE_NAME, user.refreshCookieValue())))
                .andExpect(status().isUnauthorized());

        // The new one must work.
        mockMvc.perform(csrfPost("/auth/refresh")
                        .cookie(new Cookie(RefreshTokenCookieFactory.COOKIE_NAME, newCookieValue)))
                .andExpect(status().isOk());
    }

    @Test
    void refreshWithoutCookieIsRejected() throws Exception {
        mockMvc.perform(csrfPost("/auth/refresh"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void refreshAndLogoutWithoutCsrfTokenAreForbidden() throws Exception {
        AuthedUser user = registerAndLogin("ivan", "ivan@example.com", "password123");
        Cookie refreshCookie = new Cookie(RefreshTokenCookieFactory.COOKIE_NAME, user.refreshCookieValue());

        mockMvc.perform(post("/auth/refresh").cookie(refreshCookie))
                .andExpect(status().isForbidden());
        mockMvc.perform(post("/auth/logout").cookie(refreshCookie))
                .andExpect(status().isForbidden());
    }

    @Test
    void csrfTokenFromEndpointAuthorizesRefresh() throws Exception {
        AuthedUser user = registerAndLogin("heidi", "heidi@example.com", "password123");

        MvcResult csrfResult = mockMvc.perform(get("/auth/csrf"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.headerName").value("X-XSRF-TOKEN"))
                .andExpect(cookie().path("XSRF-TOKEN", "/auth"))
                .andReturn();
        String token = objectMapper.readTree(csrfResult.getResponse().getContentAsString()).get("token").asText();
        Cookie csrfCookie = csrfResult.getResponse().getCookie("XSRF-TOKEN");

        mockMvc.perform(post("/auth/refresh")
                        .cookie(new Cookie(RefreshTokenCookieFactory.COOKIE_NAME, user.refreshCookieValue()), csrfCookie)
                        .header("X-XSRF-TOKEN", token))
                .andExpect(status().isOk());
    }

    @Test
    void logoutRevokesTheRefreshToken() throws Exception {
        AuthedUser user = registerAndLogin("frank", "frank@example.com", "password123");

        mockMvc.perform(csrfPost("/auth/logout")
                        .cookie(new Cookie(RefreshTokenCookieFactory.COOKIE_NAME, user.refreshCookieValue())))
                .andExpect(status().isNoContent());

        mockMvc.perform(csrfPost("/auth/refresh")
                        .cookie(new Cookie(RefreshTokenCookieFactory.COOKIE_NAME, user.refreshCookieValue())))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void protectedRouteRejectsMissingOrInvalidToken() throws Exception {
        mockMvc.perform(get("/users/me"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/users/me").header("Authorization", "Bearer not-a-real-token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void protectedRouteAcceptsValidToken() throws Exception {
        AuthedUser user = registerAndLogin("grace", "grace@example.com", "password123");

        mockMvc.perform(get("/users/me").header("Authorization", "Bearer " + user.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("grace@example.com"));
    }
}
