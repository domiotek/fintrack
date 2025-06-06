package com.example.fintrack.chat;

import com.example.fintrack.chat.dto.PrivateChatDto;
import com.example.fintrack.friend.Friend;
import com.example.fintrack.friend.FriendRepository;
import com.example.fintrack.friend.FriendStatus;
import com.example.fintrack.lastreadmessage.LastReadMessage;
import com.example.fintrack.lastreadmessage.LastReadMessageRepository;
import com.example.fintrack.message.Message;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

import static com.example.fintrack.exception.BusinessErrorCodes.*;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final FriendRepository friendRepository;
    private final UserProvider userProvider;
    private final LastReadMessageRepository lastReadMessageRepository;

    public List<PrivateChatDto> getPrivateChats() {
        User user = userProvider.getLoggedUser();

        List<Friend> friends = friendRepository.findFriendsByUserIdAndFriendStatus(user.getId(), FriendStatus.ACCEPTED);

        return friends.stream()
                .filter(friend -> !friend.getChat().getMessages().isEmpty())
                .map(friend -> {
                    LastReadMessage lastReadMessage = lastReadMessageRepository
                            .findLastReadMessageByUserIdAndChatId(user.getId(), friend.getChat().getId())
                            .orElseThrow();

                    Message message = friend.getChat().getMessages().stream()
                            .max(Comparator.comparing(Message::getSendTime))
                            .orElseThrow();

                    return ChatMapper.friendToPrivateChatDto(friend, message, lastReadMessage);
                })
                .toList();
    }

    public List<Long> getFriendsIdsWithPrivateChats() {
        User user = userProvider.getLoggedUser();

        List<Friend> friends = friendRepository.findFriendsByUserIdAndFriendStatus(user.getId(), FriendStatus.ACCEPTED);

        return friends.stream()
                .filter(friend -> !friend.getChat().getMessages().isEmpty())
                .map(friend -> friend.getFriend().getId())
                .toList();
    }

    public Long getFriendChatId(long friendId) {
        User user = userProvider.getLoggedUser();

        Friend friend = friendRepository
                .findFriendByUserIdAndFriendIdAndFriendStatus(user.getId(), friendId, FriendStatus.ACCEPTED)
                .orElseThrow(FRIEND_DOES_NOT_EXIST::getError);

        return friend.getChat().getId();
    }
}
