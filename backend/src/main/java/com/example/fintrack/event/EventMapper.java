package com.example.fintrack.event;

import com.example.fintrack.event.dto.EventDto;
import com.example.fintrack.event.dto.EventUserDto;
import com.example.fintrack.userevent.UserEvent;

public class EventMapper {

    public static EventDto userEventToEventDto(UserEvent userEvent) {
        return EventDto.builder()
                .name(userEvent.getEvent().getName())
                .eventStatus(userEvent.getEvent().getEventStatus())
                .isFounder(userEvent.getIsFounder())
                .numberOfNotification(2)
                .users(userEvent.getEvent().getUsers().stream()
                        .map(UserEvent::getUser)
                        .map(user -> EventUserDto.builder()
                                .id(user.getId())
                                .firstName(user.getFirstName())
                                .lastName(user.getLastName())
                                .build()
                        )
                        .toList()
                )
                .build();
    }
}
