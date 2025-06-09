package com.example.fintrack.message.dto;

import lombok.Builder;

@Builder
public record MessageTypingDto(
        Long userId
) {
}
