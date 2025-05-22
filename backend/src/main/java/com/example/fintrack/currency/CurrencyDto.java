package com.example.fintrack.currency;

import lombok.Builder;

@Builder
public record CurrencyDto(
        Long id,
        String name,
        String code
) {
}
