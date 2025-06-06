package com.example.fintrack.user.dto;

public record UpdateProfileDto(
        String firstName,
        String lastName,
        Long currencyId
) {
}
