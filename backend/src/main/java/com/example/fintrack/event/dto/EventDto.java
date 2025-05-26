package com.example.fintrack.event.dto;

import com.example.fintrack.event.EventStatus;
import lombok.Builder;

import java.util.List;

@Builder
public record EventDto(
        String name,
        EventStatus eventStatus,
        Boolean isFounder,
        Integer numberOfNotification,
        List<EventUserDto> users
) {
}
