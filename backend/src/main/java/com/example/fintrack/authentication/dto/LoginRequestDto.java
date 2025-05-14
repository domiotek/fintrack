package com.example.fintrack.authentication.dto;

public record LoginRequestDto(
        String email,
        String password
) {
}
