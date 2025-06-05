package com.example.fintrack.chat.dto;

import lombok.Builder;

@Builder
public record PrivateChatFriendDto(
        Long id,
        String firstName,
        String lastName
) {
}
