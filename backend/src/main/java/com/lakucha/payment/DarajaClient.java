package com.lakucha.payment;

import java.math.BigDecimal;

public interface DarajaClient {

    StkPushResult initiateStkPush(String phoneNumber, BigDecimal amount, String accountReference);

    record StkPushResult(String merchantRequestId, String checkoutRequestId, String responseCode, String responseDescription) {
    }
}
