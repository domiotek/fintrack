package com.example.fintrack.message.dto;

import com.example.fintrack.chat.dto.PrivateChatLastMessageUserDto;
import lombok.Builder;

@Builder
public record PrivateMessageDto(Long id,
                                String lastMessage,
                                Long lastMessageId,
                                boolean isFriend,
                                PrivateChatLastMessageUserDto otherParticipant) {
}
