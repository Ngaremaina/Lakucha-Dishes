package com.lakucha.shipping;

import com.lakucha.AbstractIntegrationTest;
import com.lakucha.shipping.dto.ShippingRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ShippingControllerIT extends AbstractIntegrationTest {

    @Test
    void shippingRoutesRequireAuth() throws Exception {
        mockMvc.perform(get("/shipping")).andExpect(status().isUnauthorized());
        mockMvc.perform(post("/shipping").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ShippingRequest("A", "B", "C", "D", "E"))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void userCanCreateReadUpdateAndDeleteTheirOwnAddress() throws Exception {
        var user = registerAndLogin("bianca", "bianca@example.com", "password123");
        String createBody = objectMapper.writeValueAsString(
                new ShippingRequest("Bianca", "Otieno", "Coast", "Beach Rd", "Mombasa"));

        String createdJson = mockMvc.perform(post("/shipping").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + user.accessToken())
                        .content(createBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.city").value("Mombasa"))
                .andReturn().getResponse().getContentAsString();
        long id = objectMapper.readTree(createdJson).get("id").asLong();

        mockMvc.perform(get("/shipping/" + id).header("Authorization", "Bearer " + user.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.city").value("Mombasa"));

        mockMvc.perform(get("/shipping").header("Authorization", "Bearer " + user.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));

        String updateBody = objectMapper.writeValueAsString(
                new ShippingRequest("Bianca", "Otieno", "Coast", "Beach Rd 2", "Malindi"));
        mockMvc.perform(patch("/shipping/" + id).contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + user.accessToken())
                        .content(updateBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.city").value("Malindi"));

        mockMvc.perform(delete("/shipping/" + id).header("Authorization", "Bearer " + user.accessToken()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/shipping/" + id).header("Authorization", "Bearer " + user.accessToken()))
                .andExpect(status().isNotFound());
    }

    @Test
    void userCannotReadUpdateOrDeleteAnotherUsersAddress() throws Exception {
        var owner = registerAndLogin("carlos", "carlos@example.com", "password123");
        var intruder = registerAndLogin("dina", "dina@example.com", "password123");
        String createBody = objectMapper.writeValueAsString(
                new ShippingRequest("Carlos", "Mwangi", "Central", "Thika Rd", "Thika"));

        String createdJson = mockMvc.perform(post("/shipping").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + owner.accessToken())
                        .content(createBody))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long id = objectMapper.readTree(createdJson).get("id").asLong();

        mockMvc.perform(get("/shipping/" + id).header("Authorization", "Bearer " + intruder.accessToken()))
                .andExpect(status().isForbidden());

        mockMvc.perform(patch("/shipping/" + id).contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + intruder.accessToken())
                        .content(createBody))
                .andExpect(status().isForbidden());

        mockMvc.perform(delete("/shipping/" + id).header("Authorization", "Bearer " + intruder.accessToken()))
                .andExpect(status().isForbidden());
    }

    @Test
    void blankFieldsAreRejected() throws Exception {
        var user = registerAndLogin("edwin", "edwin@example.com", "password123");
        String body = objectMapper.writeValueAsString(new ShippingRequest(" ", "Kamau", "Rift", "Moi Rd", "Nakuru"));

        mockMvc.perform(post("/shipping").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + user.accessToken())
                        .content(body))
                .andExpect(status().isBadRequest());
    }
}
