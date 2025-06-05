package com.example.fintrack.bill.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public record AddBillEventDto(
        @NotNull
        String name,
        @NotNull
        ZonedDateTime date,
        @NotNull
        BigDecimal amount
) {
}
