package com.example.fintrack.limit.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Builder
public record AddLimitDto(
        @NotNull
        BigDecimal amount,
        @NotNull
        ZonedDateTime startDateTime,
        ZonedDateTime endDateTime
) {
}
