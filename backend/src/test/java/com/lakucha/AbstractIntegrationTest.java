package com.lakucha;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lakucha.auth.Role;
import com.lakucha.auth.User;
import com.lakucha.auth.UserRepository;
import com.lakucha.auth.RefreshTokenCookieFactory;
import com.lakucha.auth.dto.LoginRequest;
import com.lakucha.auth.dto.RegisterRequest;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.containers.PostgreSQLContainer;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
// The whole IT suite shares one Spring context (see the singleton-container note below),
// so every test class shares this filter's bucket cache too. Production-tight limits would
// make unrelated tests fail with 429 depending on run order; the actual 429 behavior is
// covered by RateLimitFilterTest instead.
@org.springframework.test.context.TestPropertySource(properties = {
        "app.rate-limit.auth-capacity=100000",
        "app.rate-limit.payment-capacity=100000"
})
public abstract class AbstractIntegrationTest {

    // Singleton container pattern: started once for the whole JVM and never
    // stopped between test classes. Subclassing @Container (JUnit-managed
    // start/stop per class) restarts the container between test classes,
    // handing it a new mapped port each time while Spring's context cache
    // keeps serving the old port from the first context it built — every
    // test class after the first then fails to connect. Starting it manually
    // once, with no per-class stop, keeps the port (and the cached context)
    // stable across the whole suite.
    // Pinned to the tag already cached in this environment — pulling any other
    // tag (or letting Testcontainers pull the Ryuk reaper) hangs indefinitely
    // here, so TESTCONTAINERS_RYUK_DISABLED=true must also be set when running.
    @ServiceConnection
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:15-alpine")
            .withDatabaseName("lakucha_test")
            .withUsername("lakucha_test")
            .withPassword("lakucha_test");

    static {
        POSTGRES.start();
    }

    @Autowired
    protected org.springframework.test.web.servlet.MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected PasswordEncoder passwordEncoder;

    protected record AuthedUser(Long id, String email, String accessToken, String refreshCookieValue) {
    }

    protected AuthedUser registerAndLogin(String username, String email, String password) throws Exception {
        String body = objectMapper.writeValueAsString(new RegisterRequest(username, email, password));
        MvcResult result = mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn();
        return extractAuthedUser(result);
    }

    protected AuthedUser createAdminAndLogin(String username, String email, String password) throws Exception {
        User admin = User.builder()
                .username(username)
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);
        String body = objectMapper.writeValueAsString(new LoginRequest(email, password));
        MvcResult result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andReturn();
        return extractAuthedUser(result);
    }

    private AuthedUser extractAuthedUser(MvcResult result) throws Exception {
        String json = result.getResponse().getContentAsString();
        JsonNode node = objectMapper.readTree(json);
        String accessToken = node.get("accessToken").asText();
        Long id = node.get("user").get("id").asLong();
        String email = node.get("user").get("email").asText();
        Cookie cookie = result.getResponse().getCookie(RefreshTokenCookieFactory.COOKIE_NAME);
        String refreshCookieValue = cookie != null ? cookie.getValue() : null;
        return new AuthedUser(id, email, accessToken, refreshCookieValue);
    }
}
