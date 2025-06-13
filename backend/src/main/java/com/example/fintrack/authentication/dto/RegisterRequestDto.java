package com.example.fintrack.authentication.dto;

import com.example.fintrack.authentication.Password;
import com.example.fintrack.constraints.FieldsValueMatch;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@FieldsValueMatch(field = "password", fieldMatch = "confirmPassword", message = "Password and confirm password must match")
public record RegisterRequestDto(
        @Email(message = "Incorrect email")
        String email,
        @Password
        String password,
        String confirmPassword,
        @NotBlank(message = "Firstname must not be blank")
        String firstName,
        @NotBlank(message = "Lastname must not be blank")
        String lastName,
        @NotNull(message = "Currency id must not be null")
        Long currencyId
) {
}
