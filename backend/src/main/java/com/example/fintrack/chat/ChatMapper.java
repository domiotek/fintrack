package com.example.fintrack.chat;

import com.example.fintrack.chat.dto.PrivateChatDto;
import com.example.fintrack.chat.dto.PrivateChatFriendDto;
import com.example.fintrack.chat.dto.PrivateChatLastMessageDto;
import com.example.fintrack.chat.dto.PrivateChatLastMessageUserDto;
import com.example.fintrack.friend.Friend;
import com.example.fintrack.friend.FriendStatus;
import com.example.fintrack.lastreadmessage.LastReadMessage;
import com.example.fintrack.message.Message;

public class ChatMapper {

    public static PrivateChatDto friendToPrivateChatDto(Friend friend, Message message, LastReadMessage lastReadMessage) {
        return PrivateChatDto.builder()
                .id(friend.getChat().getId())
                .lastMessage(PrivateChatLastMessageDto.builder()
                        .id(message.getId())
                        .content(message.getContent())
                        .sentBy(PrivateChatLastMessageUserDto.builder()
                                .id(message.getSentBy().getId())
                                .firstName(message.getSentBy().getFirstName())
                                .lastName(message.getSentBy().getLastName())
                                .build()
                        )
                        .sentAt(message.getSendTime())
                        .build()
                )
                .lastReadMessageId(lastReadMessage.getMessage().getId())
                .isFriend(friend.getFriendStatus() == FriendStatus.ACCEPTED)
                .otherParticipant(PrivateChatFriendDto.builder()
                        .id(friend.getFriend().getId())
                        .firstName(friend.getFriend().getFirstName())
                        .lastName(friend.getFriend().getLastName())
                        .lastSeenAt(friend.getFriend().getLastSeenAt())
                        .build()
                )
                .build();
    }
}
