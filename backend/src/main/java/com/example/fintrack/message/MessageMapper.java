package com.example.fintrack.message;

import com.example.fintrack.chat.dto.PrivateChatLastMessageUserDto;
import com.example.fintrack.friend.Friend;
import com.example.fintrack.friend.FriendStatus;
import com.example.fintrack.lastreadmessage.LastReadMessage;
import com.example.fintrack.lastreadmessage.dto.LastReadMessageDto;
import com.example.fintrack.message.dto.*;
import com.example.fintrack.user.User;

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

    public static PrivateMessageDto messageToPrivateMessageDto(Message message, LastReadMessage lastReadMessage, Friend friend) {
        PrivateChatLastMessageUserDto lastReadMessageDto = PrivateChatLastMessageUserDto.builder()
                .id(friend.getId())
                .firstName(friend.getUser().getFirstName())
                .lastName(friend.getUser().getLastName())
                .build();

        return PrivateMessageDto.builder()
                .id(message.getId())
                .lastMessage(message.getContent())
                .lastMessageId(lastReadMessage.getId())
                .isFriend(friend.getFriendStatus() == FriendStatus.ACCEPTED)
                .otherParticipant(lastReadMessageDto)
                .build();
    }

    public static ReadMessageDto messageToReadMessageDto(Long userId, LastReadMessage message) {
        return ReadMessageDto.builder()
                .userId(userId)
                .messageId(message.getMessage().getId())
                .readAt(message.getReadTime())
                .build();
    }

    public static LastActivityDto messageToLastActivityDto(User user) {
        return LastActivityDto.builder()
                .userId(user.getId())
                .lastSeenAt(user.getLastSeenAt())
                .build();
    }
}
