package com.example.fintrack.event.dto;

import java.time.ZonedDateTime;

public record UpdateEventDto(
        String name,
        ZonedDateTime startDate,
        ZonedDateTime endDate,
        Long currencyId
) {
}
