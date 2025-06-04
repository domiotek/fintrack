package com.example.fintrack.bill.dto;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public record UpdateBillDto(
        String name,
        ZonedDateTime date,
        BigDecimal amount,
        Long categoryId
) {
}
