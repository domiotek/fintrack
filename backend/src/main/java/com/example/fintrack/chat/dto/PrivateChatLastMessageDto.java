package com.example.fintrack.chat.dto;

import lombok.Builder;

import java.time.ZonedDateTime;

@Builder
public record PrivateChatLastMessageDto(
        Long id,
        PrivateChatLastMessageUserDto sentBy,
        ZonedDateTime sentAt,
        String content
) {
}
