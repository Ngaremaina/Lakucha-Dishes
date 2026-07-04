package com.lakucha.order;

import com.lakucha.AbstractIntegrationTest;
import com.lakucha.cart.dto.CartItemRequest;
import com.lakucha.catalog.dto.CategoryRequest;
import com.lakucha.catalog.dto.ProductRequest;
import com.lakucha.order.dto.CheckoutRequest;
import com.lakucha.order.dto.UpdateOrderStatusRequest;
import com.lakucha.shipping.dto.ShippingRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AdminOrderControllerIT extends AbstractIntegrationTest {

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

    private long placeOrder(String adminToken, String customerToken, long productId) throws Exception {
        String shippingBody = objectMapper.writeValueAsString(new ShippingRequest("Mia", "Wanjiru", "Nairobi", "Kenyatta Ave", "Nairobi"));
        String shippingJson = mockMvc.perform(post("/shipping").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + customerToken)
                        .content(shippingBody))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long shippingId = objectMapper.readTree(shippingJson).get("id").asLong();

        mockMvc.perform(post("/cart").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + customerToken)
                        .content(objectMapper.writeValueAsString(new CartItemRequest(productId, 1))))
                .andExpect(status().isCreated());

        String orderJson = mockMvc.perform(post("/orders/checkout").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + customerToken)
                        .content(objectMapper.writeValueAsString(new CheckoutRequest(shippingId))))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(orderJson).get("id").asLong();
    }

    @Test
    void listingAllOrdersRequiresAdminRole() throws Exception {
        var customer = registerAndLogin("noel", "noel@example.com", "password123");

        mockMvc.perform(get("/admin/orders").header("Authorization", "Bearer " + customer.accessToken()))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/admin/orders")).andExpect(status().isUnauthorized());
    }

    @Test
    void adminCanListAllOrdersAndUpdateStatus() throws Exception {
        var admin = createAdminAndLogin("opal", "opal@example.com", "password123");
        long productId = createProduct(admin.accessToken(), "Steak", "1200.00");
        var customer = registerAndLogin("percy", "percy@example.com", "password123");
        long orderId = placeOrder(admin.accessToken(), customer.accessToken(), productId);

        mockMvc.perform(get("/admin/orders").header("Authorization", "Bearer " + admin.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1));

        mockMvc.perform(get("/admin/orders").queryParam("status", "PENDING_PAYMENT")
                        .header("Authorization", "Bearer " + admin.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1));

        mockMvc.perform(get("/admin/orders").queryParam("status", "DELIVERED")
                        .header("Authorization", "Bearer " + admin.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(0));

        String updateBody = objectMapper.writeValueAsString(new UpdateOrderStatusRequest(OrderStatus.PAID));
        mockMvc.perform(patch("/admin/orders/" + orderId + "/status").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + admin.accessToken())
                        .content(updateBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PAID"));

        mockMvc.perform(get("/orders/" + orderId).header("Authorization", "Bearer " + customer.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PAID"));
    }

    @Test
    void updatingStatusRequiresAdminRole() throws Exception {
        var admin = createAdminAndLogin("quincy", "quincy@example.com", "password123");
        long productId = createProduct(admin.accessToken(), "Salad", "400.00");
        var customer = registerAndLogin("rosa", "rosa@example.com", "password123");
        long orderId = placeOrder(admin.accessToken(), customer.accessToken(), productId);

        String updateBody = objectMapper.writeValueAsString(new UpdateOrderStatusRequest(OrderStatus.CANCELLED));
        mockMvc.perform(patch("/admin/orders/" + orderId + "/status").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + customer.accessToken())
                        .content(updateBody))
                .andExpect(status().isForbidden());
    }
}
