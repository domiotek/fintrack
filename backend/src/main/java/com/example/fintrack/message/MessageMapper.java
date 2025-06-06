package com.example.fintrack.message;

import com.example.fintrack.message.dto.MessageDto;
import com.example.fintrack.message.dto.MessageUserDto;

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
}
