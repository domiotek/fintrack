package com.example.fintrack.lastreadmessage.dto;

import lombok.Builder;

import java.time.ZonedDateTime;

@Builder
public record LastReadMessageDto(
        Long userId,
        Long messageId,
        ZonedDateTime readTime
) {
}
