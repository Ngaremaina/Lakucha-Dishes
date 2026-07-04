package com.lakucha.order;

import com.lakucha.AbstractIntegrationTest;
import com.lakucha.cart.dto.CartItemRequest;
import com.lakucha.catalog.dto.CategoryRequest;
import com.lakucha.catalog.dto.ProductRequest;
import com.lakucha.order.dto.CheckoutRequest;
import com.lakucha.shipping.dto.ShippingRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class OrderControllerIT extends AbstractIntegrationTest {

    private long createProduct(String adminToken, String name, String price) throws Exception {
        String categoryBody = objectMapper.writeValueAsString(new CategoryRequest(name + "-cat"));
        String categoryJson = mockMvc.perform(post("/categories").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + adminToken)
                        .content(categoryBody))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long categoryId = objectMapper.readTree(categoryJson).get("id").asLong();

        String productBody = objectMapper.writeValueAsString(
                new ProductRequest(categoryId, name, new BigDecimal(price), null, 50, null));
        String productJson = mockMvc.perform(post("/products").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + adminToken)
                        .content(productBody))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(productJson).get("id").asLong();
    }

    private long createShipping(String token) throws Exception {
        String body = objectMapper.writeValueAsString(new ShippingRequest("Dan", "Otieno", "Nairobi", "Moi Ave", "Nairobi"));
        String json = mockMvc.perform(post("/shipping").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json).get("id").asLong();
    }

    @Test
    void checkoutRequiresAuth() throws Exception {
        mockMvc.perform(post("/orders/checkout").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CheckoutRequest(1L))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void checkoutSnapshotsCartIntoOrderAndClearsCart() throws Exception {
        var admin = createAdminAndLogin("dexter", "dexter@example.com", "password123");
        long productId = createProduct(admin.accessToken(), "Burger", "250.00");
        var customer = registerAndLogin("ella", "ella@example.com", "password123");
        long shippingId = createShipping(customer.accessToken());

        mockMvc.perform(post("/cart").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + customer.accessToken())
                        .content(objectMapper.writeValueAsString(new CartItemRequest(productId, 2))))
                .andExpect(status().isCreated());

        String orderJson = mockMvc.perform(post("/orders/checkout").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + customer.accessToken())
                        .content(objectMapper.writeValueAsString(new CheckoutRequest(shippingId))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING_PAYMENT"))
                .andExpect(jsonPath("$.total").value(500.00))
                .andExpect(jsonPath("$.items.length()").value(1))
                .andExpect(jsonPath("$.items[0].productName").value("Burger"))
                .andReturn().getResponse().getContentAsString();
        long orderId = objectMapper.readTree(orderJson).get("id").asLong();

        mockMvc.perform(get("/cart").header("Authorization", "Bearer " + customer.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));

        mockMvc.perform(get("/orders/" + orderId).header("Authorization", "Bearer " + customer.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(orderId));

        mockMvc.perform(get("/orders").header("Authorization", "Bearer " + customer.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void checkoutWithEmptyCartIsRejected() throws Exception {
        var customer = registerAndLogin("felix", "felix@example.com", "password123");
        long shippingId = createShipping(customer.accessToken());

        mockMvc.perform(post("/orders/checkout").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + customer.accessToken())
                        .content(objectMapper.writeValueAsString(new CheckoutRequest(shippingId))))
                .andExpect(status().isBadRequest());
    }

    @Test
    void checkoutWithAnotherUsersShippingAddressIsRejected() throws Exception {
        var admin = createAdminAndLogin("greta", "greta@example.com", "password123");
        long productId = createProduct(admin.accessToken(), "Pizza", "800.00");
        var owner = registerAndLogin("harry", "harry@example.com", "password123");
        long shippingId = createShipping(owner.accessToken());
        var intruder = registerAndLogin("ivy", "ivy@example.com", "password123");

        mockMvc.perform(post("/cart").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + intruder.accessToken())
                        .content(objectMapper.writeValueAsString(new CartItemRequest(productId, 1))))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/orders/checkout").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + intruder.accessToken())
                        .content(objectMapper.writeValueAsString(new CheckoutRequest(shippingId))))
                .andExpect(status().isForbidden());
    }

    @Test
    void userCannotReadAnotherUsersOrder() throws Exception {
        var admin = createAdminAndLogin("jack", "jack@example.com", "password123");
        long productId = createProduct(admin.accessToken(), "Fish", "300.00");
        var owner = registerAndLogin("kate", "kate@example.com", "password123");
        long shippingId = createShipping(owner.accessToken());

        mockMvc.perform(post("/cart").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + owner.accessToken())
                        .content(objectMapper.writeValueAsString(new CartItemRequest(productId, 1))))
                .andExpect(status().isCreated());
        String orderJson = mockMvc.perform(post("/orders/checkout").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + owner.accessToken())
                        .content(objectMapper.writeValueAsString(new CheckoutRequest(shippingId))))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long orderId = objectMapper.readTree(orderJson).get("id").asLong();

        var intruder = registerAndLogin("liam2", "liam2@example.com", "password123");
        mockMvc.perform(get("/orders/" + orderId).header("Authorization", "Bearer " + intruder.accessToken()))
                .andExpect(status().isForbidden());
    }
}
