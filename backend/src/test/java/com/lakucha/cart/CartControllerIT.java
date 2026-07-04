package com.lakucha.cart;

import com.lakucha.AbstractIntegrationTest;
import com.lakucha.cart.dto.CartItemRequest;
import com.lakucha.cart.dto.UpdateQuantityRequest;
import com.lakucha.catalog.dto.CategoryRequest;
import com.lakucha.catalog.dto.ProductRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CartControllerIT extends AbstractIntegrationTest {

    private long createProduct(String adminToken, String name) throws Exception {
        String categoryBody = objectMapper.writeValueAsString(new CategoryRequest(name + "-cat"));
        String categoryJson = mockMvc.perform(post("/categories").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + adminToken)
                        .content(categoryBody))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long categoryId = objectMapper.readTree(categoryJson).get("id").asLong();

        String productBody = objectMapper.writeValueAsString(
                new ProductRequest(categoryId, name, new BigDecimal("100.00"), null, 50, null));
        String productJson = mockMvc.perform(post("/products").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + adminToken)
                        .content(productBody))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(productJson).get("id").asLong();
    }

    @Test
    void cartRoutesRequireAuth() throws Exception {
        mockMvc.perform(get("/cart")).andExpect(status().isUnauthorized());
        mockMvc.perform(post("/cart").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CartItemRequest(1L, 1))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void addingSameProductTwiceIncrementsQuantity() throws Exception {
        var admin = createAdminAndLogin("wade", "wade@example.com", "password123");
        long productId = createProduct(admin.accessToken(), "Fries");
        var customer = registerAndLogin("xena", "xena@example.com", "password123");

        mockMvc.perform(post("/cart").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + customer.accessToken())
                        .content(objectMapper.writeValueAsString(new CartItemRequest(productId, 2))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.quantity").value(2));

        mockMvc.perform(post("/cart").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + customer.accessToken())
                        .content(objectMapper.writeValueAsString(new CartItemRequest(productId, 3))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.quantity").value(5));

        mockMvc.perform(get("/cart").header("Authorization", "Bearer " + customer.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void userCannotUpdateOrDeleteAnotherUsersCartItem() throws Exception {
        var admin = createAdminAndLogin("yusuf", "yusuf@example.com", "password123");
        long productId = createProduct(admin.accessToken(), "Soda");
        var owner = registerAndLogin("zoe", "zoe@example.com", "password123");
        var intruder = registerAndLogin("abel", "abel@example.com", "password123");

        String createdJson = mockMvc.perform(post("/cart").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + owner.accessToken())
                        .content(objectMapper.writeValueAsString(new CartItemRequest(productId, 1))))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long itemId = objectMapper.readTree(createdJson).get("id").asLong();

        mockMvc.perform(patch("/cart/" + itemId).contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + intruder.accessToken())
                        .content(objectMapper.writeValueAsString(new UpdateQuantityRequest(9))))
                .andExpect(status().isForbidden());

        mockMvc.perform(delete("/cart/" + itemId)
                        .header("Authorization", "Bearer " + intruder.accessToken()))
                .andExpect(status().isForbidden());

        mockMvc.perform(patch("/cart/" + itemId).contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + owner.accessToken())
                        .content(objectMapper.writeValueAsString(new UpdateQuantityRequest(9))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(9));

        mockMvc.perform(delete("/cart/" + itemId)
                        .header("Authorization", "Bearer " + owner.accessToken()))
                .andExpect(status().isNoContent());
    }

    @Test
    void quantityMustBePositive() throws Exception {
        var admin = createAdminAndLogin("brad", "brad@example.com", "password123");
        long productId = createProduct(admin.accessToken(), "Water");
        var customer = registerAndLogin("cleo", "cleo@example.com", "password123");

        mockMvc.perform(post("/cart").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + customer.accessToken())
                        .content(objectMapper.writeValueAsString(new CartItemRequest(productId, 0))))
                .andExpect(status().isBadRequest());
    }
}
