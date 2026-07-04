package com.lakucha.payment;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.lakucha.common.PaymentProviderException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

// Excluded under the "e2e" profile in favor of FakeDarajaClient, so the Playwright smoke
// test's checkout/pay step never makes a real call to Safaricom's sandbox.
@Component
@Profile("!e2e")
public class DarajaClientImpl implements DarajaClient {

    private static final Logger log = LoggerFactory.getLogger(DarajaClientImpl.class);
    private static final DateTimeFormatter TIMESTAMP_FORMAT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private final DarajaProperties properties;
    private final RestClient restClient;

    public DarajaClientImpl(DarajaProperties properties) {
        this.properties = properties;
        this.restClient = RestClient.builder().baseUrl(properties.baseUrl()).build();
    }

    @Override
    public StkPushResult initiateStkPush(String phoneNumber, BigDecimal amount, String accountReference) {
        String accessToken = fetchAccessToken();
        // Timestamp/password are generated fresh on every call — the old Flask
        // implementation hardcoded a single stale timestamp, which broke STK push.
        String timestamp = LocalDateTime.now().format(TIMESTAMP_FORMAT);
        String password = Base64.getEncoder().encodeToString(
                (properties.shortcode() + properties.passkey() + timestamp).getBytes(StandardCharsets.UTF_8));

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("BusinessShortCode", properties.shortcode());
        body.put("Password", password);
        body.put("Timestamp", timestamp);
        body.put("TransactionType", "CustomerPayBillOnline");
        body.put("Amount", amount);
        body.put("PartyA", phoneNumber);
        body.put("PartyB", properties.shortcode());
        body.put("PhoneNumber", phoneNumber);
        body.put("CallBackURL", properties.callbackUrl());
        body.put("AccountReference", accountReference);
        body.put("TransactionDesc", "Payment of Dishes");

        StkPushApiResponse response;
        try {
            response = restClient.post()
                    .uri("/mpesa/stkpush/v1/processrequest")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(StkPushApiResponse.class);
        } catch (RestClientException ex) {
            log.error("STK push request to Daraja failed: {}", describe(ex), ex);
            throw new PaymentProviderException("Unable to reach the payment provider. Please try again shortly.", ex);
        }

        return new StkPushResult(
                response.merchantRequestId(),
                response.checkoutRequestId(),
                response.responseCode(),
                response.responseDescription());
    }

    private String fetchAccessToken() {
        String credentials = Base64.getEncoder().encodeToString(
                (properties.consumerKey() + ":" + properties.consumerSecret()).getBytes(StandardCharsets.UTF_8));
        try {
            AccessTokenResponse response = restClient.get()
                    .uri("/oauth/v1/generate?grant_type=client_credentials")
                    .header(HttpHeaders.AUTHORIZATION, "Basic " + credentials)
                    .retrieve()
                    .body(AccessTokenResponse.class);
            return response.accessToken();
        } catch (RestClientException ex) {
            log.error("Daraja OAuth token request failed: {}", describe(ex), ex);
            throw new PaymentProviderException("Unable to reach the payment provider. Please try again shortly.", ex);
        }
    }

    private String describe(RestClientException ex) {
        if (ex instanceof RestClientResponseException responseException) {
            return "status=" + responseException.getStatusCode() + " body=" + responseException.getResponseBodyAsString();
        }
        return ex.getMessage();
    }

    private record AccessTokenResponse(@JsonProperty("access_token") String accessToken) {
    }

    private record StkPushApiResponse(
            @JsonProperty("MerchantRequestID") String merchantRequestId,
            @JsonProperty("CheckoutRequestID") String checkoutRequestId,
            @JsonProperty("ResponseCode") String responseCode,
            @JsonProperty("ResponseDescription") String responseDescription) {
    }
}
