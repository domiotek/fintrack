package com.example.fintrack.user.dto;

import com.example.fintrack.authentication.Password;

public record PasswordDto(
        @Password
        String password
) {
}
