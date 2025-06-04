package com.example.fintrack.bill.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Builder
public record AddBillDto(
        @NotBlank
        String name,
        @NotNull
        BigDecimal amount,
        @NotNull
        Long categoryId,
        @NotNull
        Long currencyId,
        @NotNull
        ZonedDateTime date
) {
}
