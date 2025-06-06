package com.example.fintrack.user.dto;

import lombok.Builder;

@Builder
public record UserProfileDto(
        Long id,
        String firstName,
        String lastName,
        String email,
        UserProfileCurrencyDto currency
) {
}
