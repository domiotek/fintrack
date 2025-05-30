package com.example.fintrack.event.dto;

import lombok.Builder;

@Builder
public record EventCurrencyDto(
        Long id,
        String name,
        String code
) {
}
