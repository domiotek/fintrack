package com.example.fintrack.chat;

import com.example.fintrack.chat.dto.ChatStateDto;
import com.example.fintrack.chat.dto.PrivateChatDto;
import com.example.fintrack.friend.Friend;
import com.example.fintrack.friend.FriendRepository;
import com.example.fintrack.friend.FriendStatus;
import com.example.fintrack.lastreadmessage.LastReadMessage;
import com.example.fintrack.lastreadmessage.LastReadMessageMapper;
import com.example.fintrack.lastreadmessage.LastReadMessageRepository;
import com.example.fintrack.lastreadmessage.dto.LastReadMessageDto;
import com.example.fintrack.message.Message;
import com.example.fintrack.message.MessageMapper;
import com.example.fintrack.message.MessageRepository;
import com.example.fintrack.message.MessageType;
import com.example.fintrack.message.dto.MessageDto;
import com.example.fintrack.message.dto.SendMessageDto;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.List;

import static com.example.fintrack.exception.BusinessErrorCodes.*;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final FriendRepository friendRepository;
    private final UserProvider userProvider;
    private final LastReadMessageRepository lastReadMessageRepository;
    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatRepository chatRepository;

    public void sendMessage(long chatId, SendMessageDto sendMessageDto) {
        User user = userProvider.getLoggedUser();

        Chat chat = chatRepository.findById(chatId).orElseThrow(CHAT_DOES_NOT_EXIST::getError);

        ZonedDateTime now = ZonedDateTime.now();

        Message message = new Message();
        message.setSentBy(user);
        message.setChat(chat);
        message.setSendTime(now);
        message.setMessageType(MessageType.USER);
        message.setContent(sendMessageDto.message());

        Message savedMessage = messageRepository.save(message);

        simpMessagingTemplate.convertAndSend("/topic/chats/" + chatId + "/messages", MessageMapper.messageToMessageDto(savedMessage));

        LastReadMessage lastReadMessage = lastReadMessageRepository
                .findLastReadMessageByUserIdAndChatId(user.getId(), chatId)
                .orElseThrow(LAST_READ_MESSAGE_DOES_NOT_EXIST::getError);

        lastReadMessage.setMessage(savedMessage);
        lastReadMessage.setReadTime(now);

        lastReadMessageRepository.save(lastReadMessage);
    }

    public List<PrivateChatDto> getPrivateChats() {
        User user = userProvider.getLoggedUser();

        List<Friend> friends = friendRepository.findFriendsByUserIdAndFriendStatus(user.getId(), FriendStatus.ACCEPTED);

        return friends.stream()
                .filter(friend -> !friend.getChat().getMessages().isEmpty())
                .map(friend -> {
                    LastReadMessage lastReadMessage = lastReadMessageRepository
                            .findLastReadMessageByUserIdAndChatId(user.getId(), friend.getChat().getId())
                            .orElseThrow(LAST_READ_MESSAGE_DOES_NOT_EXIST::getError);

                    Message message = friend.getChat().getMessages().stream()
                            .max(Comparator.comparing(Message::getSendTime))
                            .orElseThrow(MESSAGE_DOES_NOT_EXIST::getError);

                    return ChatMapper.friendToPrivateChatDto(friend, message, lastReadMessage);
                })
                .toList();
    }

    public ChatStateDto getChatMessages(long messageId, long chatId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);

        Page<Message> messages = messageRepository.getMessagesByIdLessThanEqualAndChatId(messageId, chatId, pageRequest);

        Page<MessageDto> massagesDtos = messages.map(MessageMapper::messageToMessageDto);

        List<LastReadMessage> lastReadMessages = lastReadMessageRepository.findLastReadMessagesByChatId(chatId);

        List<LastReadMessageDto> userLastReadMessages = lastReadMessages.stream()
                .map(LastReadMessageMapper::lastReadMessageToLastReadMessageDto)
                .toList();

        return ChatStateDto.builder()
                .messages(massagesDtos)
                .lastReadMessages(userLastReadMessages)
                .build();
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
