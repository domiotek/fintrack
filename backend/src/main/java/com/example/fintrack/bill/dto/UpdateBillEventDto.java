package com.example.fintrack.bill.dto;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public record UpdateBillEventDto(
        String name,
        Long categoryId,
        ZonedDateTime date,
        BigDecimal amount
) {
}
