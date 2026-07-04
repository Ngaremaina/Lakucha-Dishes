package com.lakucha.profile;

import com.lakucha.AbstractIntegrationTest;
import com.lakucha.profile.dto.ProfileRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ProfileControllerIT extends AbstractIntegrationTest {

    @Test
    void getMineWithoutAuthIsRejected() throws Exception {
        mockMvc.perform(get("/profile/me")).andExpect(status().isUnauthorized());
    }

    @Test
    void getMineCreatesEmptyProfileOnFirstAccess() throws Exception {
        var user = registerAndLogin("hank", "hank@example.com", "password123");

        mockMvc.perform(get("/profile/me").header("Authorization", "Bearer " + user.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(user.id()))
                .andExpect(jsonPath("$.firstname").doesNotExist());
    }

    @Test
    void updateMineSetsFieldsAndPersists() throws Exception {
        var user = registerAndLogin("iris", "iris@example.com", "password123");
        String body = objectMapper.writeValueAsString(new ProfileRequest("Iris", "Muthoni", "0700000000", "https://img/1.png"));

        mockMvc.perform(put("/profile/me").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + user.accessToken())
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstname").value("Iris"))
                .andExpect(jsonPath("$.lastname").value("Muthoni"))
                .andExpect(jsonPath("$.phone").value("0700000000"));

        mockMvc.perform(get("/profile/me").header("Authorization", "Bearer " + user.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstname").value("Iris"));
    }

    @Test
    void eachUserOnlySeesTheirOwnProfile() throws Exception {
        var alice = registerAndLogin("judy", "judy@example.com", "password123");
        var bob = registerAndLogin("kyle", "kyle@example.com", "password123");

        mockMvc.perform(put("/profile/me").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + alice.accessToken())
                        .content(objectMapper.writeValueAsString(new ProfileRequest("Judy", "A", null, null))))
                .andExpect(status().isOk());

        mockMvc.perform(get("/profile/me").header("Authorization", "Bearer " + bob.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstname").doesNotExist());
    }
}
