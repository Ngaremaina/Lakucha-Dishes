package com.lakucha.payment;

import com.lakucha.auth.UserPrincipal;
import com.lakucha.common.ConflictException;
import com.lakucha.common.ResourceNotFoundException;
import com.lakucha.order.Order;
import com.lakucha.order.OrderService;
import com.lakucha.order.OrderStatus;
import com.lakucha.payment.dto.DarajaCallbackPayload;
import com.lakucha.payment.dto.StkPushRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderService orderService;
    private final DarajaClient darajaClient;

    public PaymentService(PaymentRepository paymentRepository, OrderService orderService, DarajaClient darajaClient) {
        this.paymentRepository = paymentRepository;
        this.orderService = orderService;
        this.darajaClient = darajaClient;
    }

    @Transactional
    public Payment initiate(UserPrincipal principal, StkPushRequest request) {
        Order order = orderService.findByIdForPrincipal(request.orderId(), principal);

        paymentRepository.findByOrderId(order.getId()).ifPresent(existing -> {
            if (existing.getStatus() == PaymentStatus.SUCCESS) {
                throw new ConflictException("Order " + order.getId() + " has already been paid for");
            }
        });

        DarajaClient.StkPushResult result = darajaClient.initiateStkPush(
                request.phoneNumber(), order.getTotal(), "ORDER-" + order.getId());

        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElseGet(() -> Payment.builder().orderId(order.getId()).build());
        payment.setPhoneNumber(request.phoneNumber());
        payment.setAmount(order.getTotal());
        payment.setCheckoutRequestId(result.checkoutRequestId());
        payment.setMerchantRequestId(result.merchantRequestId());
        payment.setStatus(PaymentStatus.PENDING);
        payment.setResultDesc(result.responseDescription());
        return paymentRepository.save(payment);
    }

    public Payment getForOrder(Long orderId, UserPrincipal principal) {
        orderService.findByIdForPrincipal(orderId, principal); // ownership check
        return paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("No payment found for order " + orderId));
    }

    @Transactional
    public void handleCallback(DarajaCallbackPayload payload) {
        if (payload == null || payload.body() == null || payload.body().stkCallback() == null) {
            return;
        }
        DarajaCallbackPayload.StkCallback callback = payload.body().stkCallback();
        paymentRepository.findByCheckoutRequestId(callback.checkoutRequestId()).ifPresent(payment -> {
            boolean success = callback.resultCode() == 0;
            payment.setStatus(success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
            payment.setResultDesc(callback.resultDesc());
            paymentRepository.save(payment);
            if (success) {
                orderService.updateStatus(payment.getOrderId(), OrderStatus.PAID);
            }
        });
    }
}
