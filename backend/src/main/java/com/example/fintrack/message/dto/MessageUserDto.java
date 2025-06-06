package com.example.fintrack.message.dto;

import lombok.Builder;

@Builder
public record MessageUserDto(
        Long id,
        String firstName,
        String lastName
) {
}
