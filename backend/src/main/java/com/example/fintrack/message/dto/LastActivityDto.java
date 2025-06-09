package com.example.fintrack.message.dto;

import lombok.Builder;

import java.time.ZonedDateTime;

@Builder
public record LastActivityDto(
        Long userId,
        ZonedDateTime lastSeenAt
) {
}
