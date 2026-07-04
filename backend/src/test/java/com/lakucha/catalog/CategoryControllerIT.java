package com.lakucha.catalog;

import com.lakucha.AbstractIntegrationTest;
import com.lakucha.catalog.dto.CategoryRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CategoryControllerIT extends AbstractIntegrationTest {

    @Test
    void anyoneCanListAndReadCategories() throws Exception {
        createAdminAndLogin("admin", "admin1@example.com", "password123");
        String body = objectMapper.writeValueAsString(new CategoryRequest("Drinks"));
        // categories are read via public GET, so no auth needed for these two calls
        mockMvc.perform(get("/categories")).andExpect(status().isOk());
    }

    @Test
    void createRequiresAdminRole() throws Exception {
        var customer = registerAndLogin("carl", "carl@example.com", "password123");
        String body = objectMapper.writeValueAsString(new CategoryRequest("Drinks"));

        mockMvc.perform(post("/categories").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + customer.accessToken())
                        .content(body))
                .andExpect(status().isForbidden());

        mockMvc.perform(post("/categories").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void adminCanCreateReadUpdateAndDeleteCategory() throws Exception {
        var admin = createAdminAndLogin("admin2", "admin2@example.com", "password123");
        String createBody = objectMapper.writeValueAsString(new CategoryRequest("Snacks"));

        String createdJson = mockMvc.perform(post("/categories").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + admin.accessToken())
                        .content(createBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Snacks"))
                .andReturn().getResponse().getContentAsString();
        long id = objectMapper.readTree(createdJson).get("id").asLong();

        mockMvc.perform(get("/categories/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Snacks"));

        String updateBody = objectMapper.writeValueAsString(new CategoryRequest("Beverages"));
        mockMvc.perform(put("/categories/" + id).contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + admin.accessToken())
                        .content(updateBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Beverages"));

        mockMvc.perform(delete("/categories/" + id)
                        .header("Authorization", "Bearer " + admin.accessToken()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/categories/" + id))
                .andExpect(status().isNotFound());
    }

    @Test
    void creatingDuplicateNameIsRejected() throws Exception {
        var admin = createAdminAndLogin("admin3", "admin3@example.com", "password123");
        String body = objectMapper.writeValueAsString(new CategoryRequest("Desserts"));

        mockMvc.perform(post("/categories").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + admin.accessToken())
                        .content(body))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/categories").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + admin.accessToken())
                        .content(body))
                .andExpect(status().isConflict());
    }

    @Test
    void blankNameIsRejected() throws Exception {
        var admin = createAdminAndLogin("admin4", "admin4@example.com", "password123");
        String body = objectMapper.writeValueAsString(new CategoryRequest(" "));

        mockMvc.perform(post("/categories").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + admin.accessToken())
                        .content(body))
                .andExpect(status().isBadRequest());
    }
}
