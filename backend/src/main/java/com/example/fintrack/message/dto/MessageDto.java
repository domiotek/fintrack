package com.example.fintrack.message.dto;

import com.example.fintrack.message.MessageType;
import lombok.Builder;

import java.time.ZonedDateTime;

@Builder
public record MessageDto(
        Long id,
        MessageType messageType,
        MessageUserDto sentBy,
        ZonedDateTime sentAt,
        String content
) {
}
