package com.example.fintrack.friend.dto;

import lombok.Builder;

import java.time.ZonedDateTime;

@Builder
public record FriendRequestDto(
        Long id,
        String firstName,
        String lastName,
        String email,
        ZonedDateTime createdAt
) {
}
