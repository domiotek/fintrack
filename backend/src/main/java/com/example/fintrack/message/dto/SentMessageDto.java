package com.example.fintrack.message.dto;

public record SentMessageDto(
        Long userId,
        String message
) {
}
