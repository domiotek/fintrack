package com.example.fintrack.authentication.dto;

import lombok.Builder;

@Builder
public record TokenDto(
        String accessToken,
        String refreshToken
) {
}
