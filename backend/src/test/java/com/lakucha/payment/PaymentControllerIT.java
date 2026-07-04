package com.lakucha.payment;

import com.lakucha.AbstractIntegrationTest;
import com.lakucha.cart.dto.CartItemRequest;
import com.lakucha.catalog.dto.CategoryRequest;
import com.lakucha.catalog.dto.ProductRequest;
import com.lakucha.order.dto.CheckoutRequest;
import com.lakucha.payment.dto.DarajaCallbackPayload;
import com.lakucha.payment.dto.StkPushRequest;
import com.lakucha.shipping.dto.ShippingRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class PaymentControllerIT extends AbstractIntegrationTest {

    @MockBean
    DarajaClient darajaClient;

    @BeforeEach
    void stubDarajaByDefault() {
        // accountReference is "ORDER-<orderId>", unique per test since each test checks
        // out a fresh order — using it to derive the checkout ID keeps rows unique across
        // the shared Postgres container the whole IT suite runs against.
        when(darajaClient.initiateStkPush(any(), any(), anyString()))
                .thenAnswer(invocation -> {
                    String accountReference = invocation.getArgument(2);
                    return new DarajaClient.StkPushResult("merchant-" + accountReference, "checkout-" + accountReference, "0",
                            "Success. Request accepted for processing");
                });
    }

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

    private long placeOrder(String customerToken, long productId) throws Exception {
        String shippingBody = objectMapper.writeValueAsString(new ShippingRequest("Ann", "Kamau", "Nairobi", "River Rd", "Nairobi"));
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
    void stkPushRequiresAuth() throws Exception {
        mockMvc.perform(post("/payments/stk-push").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new StkPushRequest(1L, "254712345678"))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void initiatingStkPushForAnotherUsersOrderIsForbidden() throws Exception {
        var admin = createAdminAndLogin("shane", "shane@example.com", "password123");
        long productId = createProduct(admin.accessToken(), "Chips", "150.00");
        var owner = registerAndLogin("tina", "tina@example.com", "password123");
        long orderId = placeOrder(owner.accessToken(), productId);
        var intruder = registerAndLogin("ursula", "ursula@example.com", "password123");

        mockMvc.perform(post("/payments/stk-push").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + intruder.accessToken())
                        .content(objectMapper.writeValueAsString(new StkPushRequest(orderId, "254712345678"))))
                .andExpect(status().isForbidden());
    }

    @Test
    void initiatingStkPushCreatesPendingPaymentUsingMockedDaraja() throws Exception {
        var admin = createAdminAndLogin("victor", "victor@example.com", "password123");
        long productId = createProduct(admin.accessToken(), "Juice", "120.00");
        var customer = registerAndLogin("wendy", "wendy@example.com", "password123");
        long orderId = placeOrder(customer.accessToken(), productId);

        mockMvc.perform(post("/payments/stk-push").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + customer.accessToken())
                        .content(objectMapper.writeValueAsString(new StkPushRequest(orderId, "254712345678"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.checkoutRequestId").value("checkout-ORDER-" + orderId));

        mockMvc.perform(get("/payments/order/" + orderId).header("Authorization", "Bearer " + customer.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void callbackWithSuccessMarksPaymentSuccessAndOrderPaid() throws Exception {
        var admin = createAdminAndLogin("xavier", "xavier@example.com", "password123");
        long productId = createProduct(admin.accessToken(), "Cake", "500.00");
        var customer = registerAndLogin("yara", "yara@example.com", "password123");
        long orderId = placeOrder(customer.accessToken(), productId);

        mockMvc.perform(post("/payments/stk-push").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + customer.accessToken())
                        .content(objectMapper.writeValueAsString(new StkPushRequest(orderId, "254712345678"))))
                .andExpect(status().isCreated());

        DarajaCallbackPayload callback = new DarajaCallbackPayload(
                new DarajaCallbackPayload.Body(
                        new DarajaCallbackPayload.StkCallback("merchant-ORDER-" + orderId, "checkout-ORDER-" + orderId, 0,
                                "The service request is processed successfully.")));

        mockMvc.perform(post("/payments/callback").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(callback)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/payments/order/" + orderId).header("Authorization", "Bearer " + customer.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"));

        mockMvc.perform(get("/orders/" + orderId).header("Authorization", "Bearer " + customer.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PAID"));
    }

    @Test
    void callbackRequiresNoAuth() throws Exception {
        DarajaCallbackPayload callback = new DarajaCallbackPayload(
                new DarajaCallbackPayload.Body(
                        new DarajaCallbackPayload.StkCallback("unknown", "unknown-checkout", 1, "Failed")));

        mockMvc.perform(post("/payments/callback").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(callback)))
                .andExpect(status().isOk());
    }

    @Test
    void cannotInitiateSecondStkPushOnceAlreadyPaid() throws Exception {
        var admin = createAdminAndLogin("zane", "zane@example.com", "password123");
        long productId = createProduct(admin.accessToken(), "Tea", "80.00");
        var customer = registerAndLogin("amara", "amara@example.com", "password123");
        long orderId = placeOrder(customer.accessToken(), productId);

        mockMvc.perform(post("/payments/stk-push").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + customer.accessToken())
                        .content(objectMapper.writeValueAsString(new StkPushRequest(orderId, "254712345678"))))
                .andExpect(status().isCreated());

        DarajaCallbackPayload callback = new DarajaCallbackPayload(
                new DarajaCallbackPayload.Body(
                        new DarajaCallbackPayload.StkCallback("merchant-ORDER-" + orderId, "checkout-ORDER-" + orderId, 0, "Success")));
        mockMvc.perform(post("/payments/callback").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(callback)))
                .andExpect(status().isOk());

        mockMvc.perform(post("/payments/stk-push").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + customer.accessToken())
                        .content(objectMapper.writeValueAsString(new StkPushRequest(orderId, "254712345678"))))
                .andExpect(status().isConflict());
    }
}
