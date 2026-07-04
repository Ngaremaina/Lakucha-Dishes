package com.lakucha.catalog;

import com.lakucha.AbstractIntegrationTest;
import com.lakucha.catalog.dto.CategoryRequest;
import com.lakucha.catalog.dto.ProductRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ProductControllerIT extends AbstractIntegrationTest {

    private long createCategory(String adminToken, String name) throws Exception {
        String body = objectMapper.writeValueAsString(new CategoryRequest(name));
        String json = mockMvc.perform(post("/categories").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + adminToken)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json).get("id").asLong();
    }

    @Test
    void anyoneCanListAndReadProductsWithoutAuth() throws Exception {
        mockMvc.perform(get("/products")).andExpect(status().isOk());
    }

    @Test
    void createRequiresAdminRole() throws Exception {
        var customer = registerAndLogin("liam", "liam@example.com", "password123");
        String body = objectMapper.writeValueAsString(new ProductRequest(null, "Chapati", BigDecimal.TEN, null, 10, null));

        mockMvc.perform(post("/products").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + customer.accessToken())
                        .content(body))
                .andExpect(status().isForbidden());

        mockMvc.perform(post("/products").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void adminCanCreateReadUpdateAndDeleteProduct() throws Exception {
        var admin = createAdminAndLogin("mona", "mona@example.com", "password123");
        long categoryId = createCategory(admin.accessToken(), "Mains");

        String createBody = objectMapper.writeValueAsString(
                new ProductRequest(categoryId, "Ugali", new BigDecimal("150.00"), "img.png", 20, "Maize meal"));
        String createdJson = mockMvc.perform(post("/products").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + admin.accessToken())
                        .content(createBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Ugali"))
                .andExpect(jsonPath("$.categoryName").value("Mains"))
                .andExpect(jsonPath("$.averageRating").value(0.0))
                .andReturn().getResponse().getContentAsString();
        long id = objectMapper.readTree(createdJson).get("id").asLong();

        mockMvc.perform(get("/products/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Ugali"));

        String updateBody = objectMapper.writeValueAsString(
                new ProductRequest(categoryId, "Ugali Special", new BigDecimal("180.00"), "img.png", 15, "Maize meal deluxe"));
        mockMvc.perform(put("/products/" + id).contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + admin.accessToken())
                        .content(updateBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Ugali Special"));

        mockMvc.perform(delete("/products/" + id)
                        .header("Authorization", "Bearer " + admin.accessToken()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/products/" + id)).andExpect(status().isNotFound());
    }

    @Test
    void creatingWithBlankNameOrNegativePriceIsRejected() throws Exception {
        var admin = createAdminAndLogin("nora", "nora@example.com", "password123");

        String blankName = objectMapper.writeValueAsString(new ProductRequest(null, " ", BigDecimal.TEN, null, 1, null));
        mockMvc.perform(post("/products").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + admin.accessToken())
                        .content(blankName))
                .andExpect(status().isBadRequest());

        String negativePrice = objectMapper.writeValueAsString(new ProductRequest(null, "Rice", new BigDecimal("-1"), null, 1, null));
        mockMvc.perform(post("/products").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + admin.accessToken())
                        .content(negativePrice))
                .andExpect(status().isBadRequest());
    }

    @Test
    void creatingWithUnknownCategoryIsRejected() throws Exception {
        var admin = createAdminAndLogin("oscar", "oscar@example.com", "password123");
        String body = objectMapper.writeValueAsString(new ProductRequest(999999L, "Beans", BigDecimal.TEN, null, 1, null));

        mockMvc.perform(post("/products").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + admin.accessToken())
                        .content(body))
                .andExpect(status().isNotFound());
    }
}
