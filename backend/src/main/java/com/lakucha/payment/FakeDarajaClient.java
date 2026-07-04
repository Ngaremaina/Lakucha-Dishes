package com.lakucha.payment;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.concurrent.atomic.AtomicLong;

// Active only under the "e2e" profile (see application-e2e.yml / the Playwright CI job),
// so the frontend smoke test can exercise the real checkout -> STK push flow without ever
// calling Safaricom's sandbox over the network.
@Component
@Profile("e2e")
public class FakeDarajaClient implements DarajaClient {

    private final AtomicLong counter = new AtomicLong();

    @Override
    public StkPushResult initiateStkPush(String phoneNumber, BigDecimal amount, String accountReference) {
        long id = counter.incrementAndGet();
        return new StkPushResult("fake-merchant-" + id, "fake-checkout-" + id, "0",
                "Success. Request accepted for processing");
    }
}
