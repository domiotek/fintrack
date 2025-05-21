package com.example.fintrack.user.dto;

import lombok.Builder;

@Builder
public record UserProfileCurrencyDto(
        String name,
        String code
) {
}
