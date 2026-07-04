package com.lakucha.payment;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.daraja")
public record DarajaProperties(
        String baseUrl,
        String consumerKey,
        String consumerSecret,
        String shortcode,
        String passkey,
        String callbackUrl
) {
}
