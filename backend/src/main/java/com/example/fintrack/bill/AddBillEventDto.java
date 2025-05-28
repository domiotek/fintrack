package com.example.fintrack.bill;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AddBillEventDto(
        String name,
        LocalDateTime date,
        BigDecimal amount,
        Long categoryId,
        Long paidById
) {
}
