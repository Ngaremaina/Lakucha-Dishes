package com.lakucha.auth;

import com.lakucha.auth.dto.AuthResponse;
import com.lakucha.auth.dto.LoginRequest;
import com.lakucha.auth.dto.RegisterRequest;
import com.lakucha.auth.dto.UserSummary;
import com.lakucha.common.ConflictException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthService(UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        AuthenticationManager authenticationManager,
                        JwtService jwtService,
                        RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    public record Issued(AuthResponse response, String rawRefreshToken) {
    }

    @Transactional
    public Issued register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ConflictException("An account with this email already exists");
        }
        // Role is never taken from client input — every self-registration is a
        // CUSTOMER. Promoting to ADMIN is an out-of-band operation.
        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(Role.CUSTOMER)
                .build();
        user = userRepository.save(user);
        return issueTokens(user);
    }

    public Issued login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        } catch (org.springframework.security.core.AuthenticationException e) {
            throw new BadCredentialsException("Invalid email or password");
        }
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
        return issueTokens(user);
    }

    @Transactional
    public Issued refresh(String rawRefreshToken) {
        if (rawRefreshToken == null) {
            throw new BadCredentialsException("Missing refresh token");
        }
        RefreshTokenService.RotationResult rotation = refreshTokenService.rotate(rawRefreshToken);
        User user = userRepository.findById(rotation.userId())
                .orElseThrow(() -> new BadCredentialsException("User no longer exists"));
        AuthResponse response = AuthResponse.of(
                jwtService.generateAccessToken(user), jwtService.getAccessTokenTtlSeconds(), UserSummary.from(user));
        return new Issued(response, rotation.rawToken());
    }

    public void logout(String rawRefreshToken) {
        if (rawRefreshToken != null) {
            refreshTokenService.revoke(rawRefreshToken);
        }
    }

    private Issued issueTokens(User user) {
        String rawRefreshToken = refreshTokenService.issue(user.getId());
        AuthResponse response = AuthResponse.of(
                jwtService.generateAccessToken(user), jwtService.getAccessTokenTtlSeconds(), UserSummary.from(user));
        return new Issued(response, rawRefreshToken);
    }
}
