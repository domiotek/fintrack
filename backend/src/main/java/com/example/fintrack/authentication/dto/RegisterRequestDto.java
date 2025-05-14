package com.example.fintrack.authentication.dto;

public record RegisterRequestDto(
        String email,
        String password,
        String confirmPassword,
        String firstName,
        String lastName
) {
}
