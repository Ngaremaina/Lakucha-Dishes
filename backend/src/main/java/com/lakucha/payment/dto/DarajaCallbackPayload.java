package com.lakucha.payment.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record DarajaCallbackPayload(@JsonProperty("Body") Body body) {

    public record Body(@JsonProperty("stkCallback") StkCallback stkCallback) {
    }

    public record StkCallback(
            @JsonProperty("MerchantRequestID") String merchantRequestId,
            @JsonProperty("CheckoutRequestID") String checkoutRequestId,
            @JsonProperty("ResultCode") int resultCode,
            @JsonProperty("ResultDesc") String resultDesc) {
    }
}
