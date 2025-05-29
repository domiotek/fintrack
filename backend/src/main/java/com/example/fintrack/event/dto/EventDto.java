package com.example.fintrack.event.dto;

import com.example.fintrack.event.enums.EventStatus;
import lombok.Builder;

import java.util.List;

@Builder
public record EventDto(
        Long id,
        String name,
        EventStatus status,
        Boolean isFounder,
        Integer numberOfNotifications,
        EventCurrencyDto currency,
        List<EventUserDto> users
) {
}
