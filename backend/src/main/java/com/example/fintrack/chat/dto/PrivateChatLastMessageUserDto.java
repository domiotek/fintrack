package com.example.fintrack.chat.dto;

import lombok.Builder;

@Builder
public record PrivateChatLastMessageUserDto(
        Long id,
        String firstName,
        String lastName
) {
}
