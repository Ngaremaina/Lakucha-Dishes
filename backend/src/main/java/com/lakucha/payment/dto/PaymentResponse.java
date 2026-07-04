package com.lakucha.payment.dto;

import com.lakucha.payment.Payment;
import com.lakucha.payment.PaymentStatus;

import java.math.BigDecimal;

public record PaymentResponse(
        Long id,
        Long orderId,
        PaymentStatus status,
        BigDecimal amount,
        String checkoutRequestId,
        String resultDesc
) {
    public static PaymentResponse from(Payment payment) {
        return new PaymentResponse(payment.getId(), payment.getOrderId(), payment.getStatus(),
                payment.getAmount(), payment.getCheckoutRequestId(), payment.getResultDesc());
    }
}
