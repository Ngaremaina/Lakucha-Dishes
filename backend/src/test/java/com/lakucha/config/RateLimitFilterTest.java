package com.lakucha.config;

import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

class RateLimitFilterTest {

    @Test
    void allowsRequestsUpToCapacityThenRejectsWithRetryAfter() throws Exception {
        RateLimitFilter filter = new RateLimitFilter(2, 60, 5, 60);
        FilterChain chain = mock(FilterChain.class);

        for (int i = 0; i < 2; i++) {
            MockHttpServletRequest request = loginRequest();
            MockHttpServletResponse response = new MockHttpServletResponse();
            filter.doFilter(request, response, chain);
            assertThat(response.getStatus()).isEqualTo(200);
        }

        MockHttpServletRequest thirdRequest = loginRequest();
        MockHttpServletResponse thirdResponse = new MockHttpServletResponse();
        FilterChain thirdChain = mock(FilterChain.class);
        filter.doFilter(thirdRequest, thirdResponse, thirdChain);

        assertThat(thirdResponse.getStatus()).isEqualTo(429);
        assertThat(thirdResponse.getHeader("Retry-After")).isEqualTo("60");
        assertThat(thirdResponse.getContentAsString()).contains("Too many requests");
        verifyNoInteractions(thirdChain);
    }

    @Test
    void differentClientIpsGetIndependentBuckets() throws Exception {
        RateLimitFilter filter = new RateLimitFilter(1, 60, 5, 60);
        FilterChain chain = mock(FilterChain.class);

        MockHttpServletRequest first = loginRequest();
        first.setRemoteAddr("10.0.0.1");
        MockHttpServletResponse firstResponse = new MockHttpServletResponse();
        filter.doFilter(first, firstResponse, chain);
        assertThat(firstResponse.getStatus()).isEqualTo(200);

        MockHttpServletRequest second = loginRequest();
        second.setRemoteAddr("10.0.0.2");
        MockHttpServletResponse secondResponse = new MockHttpServletResponse();
        filter.doFilter(second, secondResponse, chain);
        assertThat(secondResponse.getStatus()).isEqualTo(200);
    }

    @Test
    void nonRateLimitedRouteIsUnaffected() throws Exception {
        RateLimitFilter filter = new RateLimitFilter(1, 60, 1, 60);
        FilterChain chain = mock(FilterChain.class);

        for (int i = 0; i < 5; i++) {
            MockHttpServletRequest request = new MockHttpServletRequest("GET", "/products");
            MockHttpServletResponse response = new MockHttpServletResponse();
            filter.doFilter(request, response, chain);
        }

        verify(chain, org.mockito.Mockito.times(5)).doFilter(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any());
    }

    private MockHttpServletRequest loginRequest() {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/auth/login");
        request.setRemoteAddr("127.0.0.1");
        return request;
    }
}
