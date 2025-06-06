package com.example.fintrack.chat.dto;

import com.example.fintrack.lastreadmessage.dto.LastReadMessageDto;
import com.example.fintrack.message.dto.MessageDto;
import lombok.Builder;
import org.springframework.data.domain.Page;

import java.util.List;

@Builder
public record ChatStateDto(
        Page<MessageDto> messages,
        List<LastReadMessageDto> lastReadMessages
) {
}
