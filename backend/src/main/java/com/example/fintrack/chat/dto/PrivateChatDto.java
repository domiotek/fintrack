package com.example.fintrack.chat.dto;

import lombok.Builder;

@Builder
public record PrivateChatDto(
        Long id,
        PrivateChatLastMessageDto lastMessage,
        Long lastReadMessageId,
        Boolean isFriend,
        PrivateChatFriendDto otherParticipant
) {
}
