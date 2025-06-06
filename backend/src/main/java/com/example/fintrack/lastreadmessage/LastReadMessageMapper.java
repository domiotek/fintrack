package com.example.fintrack.lastreadmessage;

import com.example.fintrack.lastreadmessage.dto.LastReadMessageDto;

public class LastReadMessageMapper {

    public static LastReadMessageDto lastReadMessageToLastReadMessageDto(LastReadMessage lastReadMessage) {
        return LastReadMessageDto.builder()
                .userId(lastReadMessage.getUser().getId())
                .messageId(lastReadMessage.getMessage().getId())
                .readTime(lastReadMessage.getReadTime())
                .build();
    }
}
