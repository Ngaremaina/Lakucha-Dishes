package com.lakucha.contact;

import com.lakucha.AbstractIntegrationTest;
import com.lakucha.contact.dto.ContactRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ContactControllerIT extends AbstractIntegrationTest {

    @Test
    void anyoneCanSubmitAContactMessage() throws Exception {
        String body = objectMapper.writeValueAsString(new ContactRequest("Frank", "frank@example.com", "Hello there"));

        mockMvc.perform(post("/contact").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Frank"))
                .andExpect(jsonPath("$.email").value("frank@example.com"));
    }

    @Test
    void invalidEmailIsRejected() throws Exception {
        String body = objectMapper.writeValueAsString(new ContactRequest("Gina", "not-an-email", "Hi"));

        mockMvc.perform(post("/contact").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void listingMessagesRequiresAdminRole() throws Exception {
        var customer = registerAndLogin("harold", "harold@example.com", "password123");

        mockMvc.perform(get("/contact")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/contact").header("Authorization", "Bearer " + customer.accessToken()))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminCanListAndDeleteMessages() throws Exception {
        var admin = createAdminAndLogin("iris2", "iris2@example.com", "password123");
        String body = objectMapper.writeValueAsString(new ContactRequest("Jamie", "jamie@example.com", "Question about menu"));

        String createdJson = mockMvc.perform(post("/contact").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long id = objectMapper.readTree(createdJson).get("id").asLong();

        mockMvc.perform(get("/contact").header("Authorization", "Bearer " + admin.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[?(@.id == " + id + ")]").exists());

        mockMvc.perform(delete("/contact/" + id).header("Authorization", "Bearer " + admin.accessToken()))
                .andExpect(status().isNoContent());

        mockMvc.perform(delete("/contact/" + id).header("Authorization", "Bearer " + admin.accessToken()))
                .andExpect(status().isNotFound());
    }

    @Test
    void deletingMessageRequiresAdminRole() throws Exception {
        var customer = registerAndLogin("kevin", "kevin@example.com", "password123");

        mockMvc.perform(delete("/contact/1").header("Authorization", "Bearer " + customer.accessToken()))
                .andExpect(status().isForbidden());
    }
}
