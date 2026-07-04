package com.lakucha.catalog;

import com.lakucha.AbstractIntegrationTest;
import com.lakucha.catalog.dto.CategoryRequest;
import com.lakucha.catalog.dto.ProductRequest;
import com.lakucha.catalog.dto.RatingRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class RatingControllerIT extends AbstractIntegrationTest {

    private long createProduct(String adminToken, String name) throws Exception {
        String categoryBody = objectMapper.writeValueAsString(new CategoryRequest(name + "-cat"));
        String categoryJson = mockMvc.perform(post("/categories").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + adminToken)
                        .content(categoryBody))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long categoryId = objectMapper.readTree(categoryJson).get("id").asLong();

        String productBody = objectMapper.writeValueAsString(
                new ProductRequest(categoryId, name, new BigDecimal("100.00"), null, 5, null));
        String productJson = mockMvc.perform(post("/products").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + adminToken)
                        .content(productBody))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(productJson).get("id").asLong();
    }

    @Test
    void listingRatingsRequiresNoAuth() throws Exception {
        var admin = createAdminAndLogin("pearl", "pearl@example.com", "password123");
        long productId = createProduct(admin.accessToken(), "Samosa");

        mockMvc.perform(get("/products/" + productId + "/ratings")).andExpect(status().isOk());
    }

    @Test
    void ratingRequiresAuth() throws Exception {
        var admin = createAdminAndLogin("quinn", "quinn@example.com", "password123");
        long productId = createProduct(admin.accessToken(), "Mandazi");
        String body = objectMapper.writeValueAsString(new RatingRequest(5, "great"));

        mockMvc.perform(post("/products/" + productId + "/ratings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void userCanRateAndReratingUpdatesTheSameEntry() throws Exception {
        var admin = createAdminAndLogin("ruth", "ruth@example.com", "password123");
        long productId = createProduct(admin.accessToken(), "Pilau");
        var customer = registerAndLogin("sam", "sam@example.com", "password123");

        String firstBody = objectMapper.writeValueAsString(new RatingRequest(3, "ok"));
        mockMvc.perform(post("/products/" + productId + "/ratings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + customer.accessToken())
                        .content(firstBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.score").value(3));

        String secondBody = objectMapper.writeValueAsString(new RatingRequest(5, "actually great"));
        mockMvc.perform(post("/products/" + productId + "/ratings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + customer.accessToken())
                        .content(secondBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.score").value(5));

        mockMvc.perform(get("/products/" + productId + "/ratings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].score").value(5));

        mockMvc.perform(get("/products/" + productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.averageRating").value(5.0))
                .andExpect(jsonPath("$.ratingCount").value(1));
    }

    @Test
    void ratingScoreOutOfRangeIsRejected() throws Exception {
        var admin = createAdminAndLogin("tom", "tom@example.com", "password123");
        long productId = createProduct(admin.accessToken(), "Nyama");
        var customer = registerAndLogin("uma", "uma@example.com", "password123");

        String body = objectMapper.writeValueAsString(new RatingRequest(6, "too high"));
        mockMvc.perform(post("/products/" + productId + "/ratings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + customer.accessToken())
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void ratingUnknownProductReturnsNotFound() throws Exception {
        var customer = registerAndLogin("vera", "vera@example.com", "password123");
        String body = objectMapper.writeValueAsString(new RatingRequest(4, "n/a"));

        mockMvc.perform(post("/products/999999/ratings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + customer.accessToken())
                        .content(body))
                .andExpect(status().isNotFound());
    }
}
