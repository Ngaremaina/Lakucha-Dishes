package com.lakucha.shipping;

import com.lakucha.auth.UserPrincipal;
import com.lakucha.shipping.dto.ShippingRequest;
import com.lakucha.shipping.dto.ShippingResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shipping")
public class ShippingController {

    private final ShippingService shippingService;

    public ShippingController(ShippingService shippingService) {
        this.shippingService = shippingService;
    }

    @GetMapping
    public List<ShippingResponse> getMine(@AuthenticationPrincipal UserPrincipal user) {
        return shippingService.findForUser(user.getId()).stream().map(ShippingResponse::from).toList();
    }

    @GetMapping("/{id}")
    public ShippingResponse getById(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal user) {
        return ShippingResponse.from(shippingService.findByIdForPrincipal(id, user));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ShippingResponse create(@AuthenticationPrincipal UserPrincipal user, @Valid @RequestBody ShippingRequest request) {
        return ShippingResponse.from(shippingService.create(user.getId(), request));
    }

    @PatchMapping("/{id}")
    public ShippingResponse update(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal user,
                                    @Valid @RequestBody ShippingRequest request) {
        return ShippingResponse.from(shippingService.update(id, user, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal user) {
        shippingService.delete(id, user);
    }
}
