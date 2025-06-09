package com.example.fintrack.chat.dto;

import lombok.Builder;

import java.time.ZonedDateTime;

@Builder
public record PrivateChatFriendDto(
        Long id,
        String firstName,
        String lastName,
        ZonedDateTime lastSeenAt
) {
}
