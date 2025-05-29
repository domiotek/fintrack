package com.example.fintrack.event.dto;

import lombok.Builder;

@Builder
public record SettlementDto(
        SettlementUserDto user,
        SettlementCurrencyDto settlement
) {
}
