package com.lakucha.payment;

import com.lakucha.auth.UserPrincipal;
import com.lakucha.payment.dto.DarajaCallbackPayload;
import com.lakucha.payment.dto.PaymentResponse;
import com.lakucha.payment.dto.StkPushRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/stk-push")
    @ResponseStatus(HttpStatus.CREATED)
    public PaymentResponse initiate(@AuthenticationPrincipal UserPrincipal user, @Valid @RequestBody StkPushRequest request) {
        return PaymentResponse.from(paymentService.initiate(user, request));
    }

    @GetMapping("/order/{orderId}")
    public PaymentResponse getForOrder(@PathVariable Long orderId, @AuthenticationPrincipal UserPrincipal user) {
        return PaymentResponse.from(paymentService.getForOrder(orderId, user));
    }

    @PostMapping("/callback")
    public void callback(@RequestBody DarajaCallbackPayload payload) {
        paymentService.handleCallback(payload);
    }
}
