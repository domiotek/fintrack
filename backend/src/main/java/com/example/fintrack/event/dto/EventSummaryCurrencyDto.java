package com.example.fintrack.event.dto;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record EventSummaryCurrencyDto(
        BigDecimal amount,
        BigDecimal costPerUser
) {
}
