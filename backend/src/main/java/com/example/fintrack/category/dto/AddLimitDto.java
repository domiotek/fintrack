package com.example.fintrack.category.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Builder
public record AddLimitDto(
        @NotNull
        Long categoryId,
        @NotNull
        BigDecimal amount,
        @NotNull
        ZonedDateTime startDateTime,
        ZonedDateTime endDateTime
) {
}
