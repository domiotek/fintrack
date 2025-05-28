package com.example.fintrack.event.dto;

import com.example.fintrack.event.EventStatus;
import lombok.Builder;

import java.util.List;

@Builder
public record EventDto(
        Long id,
        String name,
        EventStatus status,
        Boolean isFounder,
        Integer numberOfNotifications,
        Long currencyId,
        List<EventUserDto> users
) {
}
