package com.example.fintrack.user.dto;

import lombok.Builder;

@Builder
public record UserProfileCurrencyDto(
        Long id,
        String name,
        String code
) {
}
