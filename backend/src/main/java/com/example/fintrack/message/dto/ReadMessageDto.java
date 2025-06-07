package com.example.fintrack.message.dto;

import lombok.Builder;

import java.time.ZonedDateTime;

@Builder
public record ReadMessageDto(Long userId,
                             Long messageId,
                             ZonedDateTime readAt) {
}
