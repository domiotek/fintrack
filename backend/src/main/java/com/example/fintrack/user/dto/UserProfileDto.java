package com.example.fintrack.user.dto;

import lombok.Builder;

@Builder
public record UserProfileDto(
        String firstName,
        String email,
        UserProfileCurrencyDto currency
) {
}
