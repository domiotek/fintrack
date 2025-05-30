package com.example.fintrack.event.dto;

import lombok.Builder;

@Builder
public record SettlementUserDto(
        Long id,
        String firstname,
        String lastname
) {
}
