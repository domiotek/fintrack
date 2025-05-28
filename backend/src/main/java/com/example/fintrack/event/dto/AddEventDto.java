package com.example.fintrack.event.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record AddEventDto(
        @NotBlank
        String name,
        @NotNull
        Long currencyId,
        @NotNull
        LocalDateTime startDate,
        LocalDateTime endDate
) {
}
