package com.lakucha.shipping.dto;

import com.lakucha.shipping.Shipping;

public record ShippingResponse(
        Long id,
        Long userId,
        String firstname,
        String lastname,
        String region,
        String address,
        String city
) {
    public static ShippingResponse from(Shipping shipping) {
        return new ShippingResponse(shipping.getId(), shipping.getUserId(), shipping.getFirstname(),
                shipping.getLastname(), shipping.getRegion(), shipping.getAddress(), shipping.getCity());
    }
}
