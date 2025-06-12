package com.example.fintrack.lastreadmessage;

import com.example.fintrack.lastreadmessage.dto.LastReadMessageDto;

public class LastReadMessageMapper {

    public static LastReadMessageDto lastReadMessageToLastReadMessageDto(LastReadMessage lastReadMessage) {
        Long messageId = null;
        if (lastReadMessage.getMessage() != null) {
            messageId = lastReadMessage.getMessage().getId();
        }

        return LastReadMessageDto.builder()
                .userId(lastReadMessage.getUser().getId())
                .messageId(messageId)
                .readTime(lastReadMessage.getReadTime())
                .build();
    }
}
