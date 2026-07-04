package com.lakucha.order;

import com.lakucha.auth.UserPrincipal;
import com.lakucha.cart.CartItem;
import com.lakucha.cart.CartItemRepository;
import com.lakucha.common.ForbiddenException;
import com.lakucha.common.OwnershipGuard;
import com.lakucha.common.ResourceNotFoundException;
import com.lakucha.order.dto.CheckoutRequest;
import com.lakucha.shipping.Shipping;
import com.lakucha.shipping.ShippingRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final ShippingRepository shippingRepository;

    public OrderService(OrderRepository orderRepository, CartItemRepository cartItemRepository,
                         ShippingRepository shippingRepository) {
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
        this.shippingRepository = shippingRepository;
    }

    @Transactional
    public Order checkout(Long userId, CheckoutRequest request) {
        Shipping shipping = shippingRepository.findById(request.shippingId())
                .orElseThrow(() -> new ResourceNotFoundException("Shipping address " + request.shippingId() + " not found"));
        if (!shipping.getUserId().equals(userId)) {
            throw new ForbiddenException("Shipping address does not belong to you");
        }

        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cannot checkout an empty cart");
        }

        Order order = Order.builder()
                .userId(userId)
                .shippingId(shipping.getId())
                .status(OrderStatus.PENDING_PAYMENT)
                .total(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            BigDecimal unitPrice = cartItem.getProduct().getPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            OrderItem item = OrderItem.builder()
                    .productId(cartItem.getProduct().getId())
                    .productNameSnapshot(cartItem.getProduct().getName())
                    .unitPriceSnapshot(unitPrice)
                    .quantity(cartItem.getQuantity())
                    .lineTotal(lineTotal)
                    .build();
            order.addItem(item);
            total = total.add(lineTotal);
        }
        order.setTotal(total);

        Order saved = orderRepository.save(order);
        cartItemRepository.deleteByUserId(userId);
        return saved;
    }

    public List<Order> findForUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order findByIdForPrincipal(Long id, UserPrincipal principal) {
        Order order = findById(id);
        OwnershipGuard.requireOwnerOrAdmin(order.getUserId(), principal);
        return order;
    }

    public Order findById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order " + id + " not found"));
    }

    public Page<Order> findAllForAdmin(OrderStatus status, Pageable pageable) {
        if (status != null) {
            return orderRepository.findByStatus(status, pageable);
        }
        return orderRepository.findAll(pageable);
    }

    @Transactional
    public Order updateStatus(Long id, OrderStatus status) {
        Order order = findById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
