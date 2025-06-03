package com.example.fintrack.bill.dto;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public record UpdateBillEventDto(
        String name,
        ZonedDateTime date,
        BigDecimal amount
) {
}
