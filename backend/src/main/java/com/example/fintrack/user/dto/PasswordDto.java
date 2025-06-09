package com.example.fintrack.user.dto;

import com.example.fintrack.authentication.Password;

public record PasswordDto(
        String oldPassword,
        @Password
        String newPassword
) {
}
