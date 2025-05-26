package com.example.fintrack.event.dto;

import lombok.Builder;

@Builder
public record EventUserDto(
        Long id,
        String firstName,
        String lastName
) {
}
