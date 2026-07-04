package com.lakucha.shipping;

import com.lakucha.auth.UserPrincipal;
import com.lakucha.common.OwnershipGuard;
import com.lakucha.common.ResourceNotFoundException;
import com.lakucha.shipping.dto.ShippingRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ShippingService {

    private final ShippingRepository shippingRepository;

    public ShippingService(ShippingRepository shippingRepository) {
        this.shippingRepository = shippingRepository;
    }

    public List<Shipping> findForUser(Long userId) {
        return shippingRepository.findByUserId(userId);
    }

    public Shipping findByIdForPrincipal(Long id, UserPrincipal principal) {
        Shipping shipping = findById(id);
        OwnershipGuard.requireOwnerOrAdmin(shipping.getUserId(), principal);
        return shipping;
    }

    Shipping findById(Long id) {
        return shippingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipping address " + id + " not found"));
    }

    @Transactional
    public Shipping create(Long userId, ShippingRequest request) {
        Shipping shipping = Shipping.builder()
                .userId(userId)
                .firstname(request.firstname())
                .lastname(request.lastname())
                .region(request.region())
                .address(request.address())
                .city(request.city())
                .build();
        return shippingRepository.save(shipping);
    }

    @Transactional
    public Shipping update(Long id, UserPrincipal principal, ShippingRequest request) {
        Shipping shipping = findByIdForPrincipal(id, principal);
        shipping.setFirstname(request.firstname());
        shipping.setLastname(request.lastname());
        shipping.setRegion(request.region());
        shipping.setAddress(request.address());
        shipping.setCity(request.city());
        return shippingRepository.save(shipping);
    }

    @Transactional
    public void delete(Long id, UserPrincipal principal) {
        Shipping shipping = findByIdForPrincipal(id, principal);
        shippingRepository.delete(shipping);
    }
}
