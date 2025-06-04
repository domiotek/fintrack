package com.example.fintrack.limit.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Builder
public record LimitDto(
        BigDecimal amount,
        ZonedDateTime startDateTime,
        ZonedDateTime endDateTime
) {
}
