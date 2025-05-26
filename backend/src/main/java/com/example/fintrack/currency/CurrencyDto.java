package com.example.fintrack.currency;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record CurrencyDto(
        Long id,
        String name,
        String code,
        BigDecimal rate
) {
}
