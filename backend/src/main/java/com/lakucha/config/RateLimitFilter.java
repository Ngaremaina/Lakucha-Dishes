package com.lakucha.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Basic in-memory rate limiting on the endpoints most attractive to brute-force/abuse:
 * auth (credential stuffing, account enumeration) and STK push (each call reaches out to
 * Safaricom and can incur cost). Buckets are keyed by client IP, so this only protects a
 * single instance — fine for the one-Render-web-service deployment target in the workplan;
 * a multi-instance deployment would need a shared store (e.g. bucket4j-redis) instead.
 *
 * Not a @Component: like JwtAuthenticationFilter, it's only exposed as a @Bean inside
 * SecurityConfig and wired via addFilterBefore, so Spring Boot's servlet-container
 * auto-registration doesn't also mount it as a second, independent top-level filter.
 *
 * Limits are constructor-injected (rather than hardcoded) so the IT suite — which shares
 * one Spring context and therefore one instance of this filter's bucket cache across every
 * test class — can run with generous test-only limits (see application.yml under
 * src/test/resources) while production keeps tight defaults; the tight-limit behavior itself
 * is covered by a plain unit test that builds its own instance.
 */
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitRule authRule;
    private final RateLimitRule paymentRule;
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    public RateLimitFilter(int authCapacity, int authPeriodSeconds, int paymentCapacity, int paymentPeriodSeconds) {
        this.authRule = new RateLimitRule("auth", authCapacity, authPeriodSeconds);
        this.paymentRule = new RateLimitRule("payment", paymentCapacity, paymentPeriodSeconds);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        RateLimitRule rule = ruleFor(request);
        if (rule != null) {
            String key = rule.name() + ":" + clientIp(request);
            Bucket bucket = buckets.computeIfAbsent(key, k -> newBucket(rule));
            if (!bucket.tryConsume(1)) {
                response.setStatus(429);
                response.setHeader("Retry-After", String.valueOf(rule.periodSeconds()));
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Too many requests, please try again later\"}");
                return;
            }
        }
        filterChain.doFilter(request, response);
    }

    private Bucket newBucket(RateLimitRule rule) {
        Bandwidth limit = Bandwidth.classic(rule.capacity(),
                io.github.bucket4j.Refill.greedy(rule.capacity(), Duration.ofSeconds(rule.periodSeconds())));
        return Bucket.builder().addLimit(limit).build();
    }

    private RateLimitRule ruleFor(HttpServletRequest request) {
        String method = request.getMethod();
        String path = request.getRequestURI();
        if (!"POST".equals(method)) {
            return null;
        }
        if (path.endsWith("/auth/login") || path.endsWith("/auth/register")) {
            return authRule;
        }
        if (path.endsWith("/payments/stk-push")) {
            return paymentRule;
        }
        return null;
    }

    private String clientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private record RateLimitRule(String name, int capacity, int periodSeconds) {
    }
}
