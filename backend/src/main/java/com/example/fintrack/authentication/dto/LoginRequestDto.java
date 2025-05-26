package com.example.fintrack.authentication.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequestDto(
        @Email(message = "Incorrect email")
        String email,
        @NotBlank(message = "Password must not be blank")
        String password
) {
}
