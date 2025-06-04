package com.example.fintrack.friend.dto;

import lombok.Builder;

@Builder
public record FriendDto(
        Long id,
        String firstName,
        String lastName,
        String email
) {
}
