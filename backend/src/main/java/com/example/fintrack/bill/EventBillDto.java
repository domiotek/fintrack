package com.example.fintrack.bill;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record EventBillDto(
        Long id,
        String name,
        LocalDateTime date,
        EventBillUserDto paidBy,
        BigDecimal amount,
        BigDecimal costPerUser
) {
}
