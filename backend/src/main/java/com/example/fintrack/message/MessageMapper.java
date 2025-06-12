package com.example.fintrack.message;

import com.example.fintrack.chat.Chat;
import com.example.fintrack.lastreadmessage.LastReadMessage;
import com.example.fintrack.message.dto.*;
import com.example.fintrack.user.User;

import java.time.ZonedDateTime;

public class MessageMapper {

    public static MessageDto messageToMessageDto(Message message) {
        return MessageDto.builder()
                .id(message.getId())
                .messageType(message.getMessageType())
                .sentBy(MessageUserDto.builder()
                        .id(message.getSentBy().getId())
                        .firstName(message.getSentBy().getFirstName())
                        .lastName(message.getSentBy().getLastName())
                        .build()
                )
                .sentAt(message.getSendTime())
                .content(message.getContent())
                .build();
    }

    public static ReadMessageDto messageToReadMessageDto(Long userId, LastReadMessage message) {
        return ReadMessageDto.builder()
                .userId(userId)
                .messageId(message.getMessage().getId())
                .readAt(message.getReadTime())
                .build();
    }

    public static LastActivityDto userToLastActivityDto(User user) {
        return LastActivityDto.builder()
                .userId(user.getId())
                .lastSeenAt(user.getLastSeenAt())
                .build();
    }

    public static Message messageDtoToMessage(User user, Chat chat, ZonedDateTime now, MessageType messageType, String content) {
        Message message = new Message();
        message.setSentBy(user);
        message.setChat(chat);
        message.setSendTime(now);
        message.setMessageType(messageType);
        message.setContent(content);

        return message;
    }

    public static MessageTypingDto messageToMessageTypingDto(Long userId) {
        return MessageTypingDto.builder()
                .userId(userId)
                .build();
    }
}
