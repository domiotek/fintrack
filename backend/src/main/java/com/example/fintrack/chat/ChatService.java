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
import com.example.fintrack.message.dto.MessageTypingDto;
import com.example.fintrack.message.dto.ReadMessageDto;
import com.example.fintrack.message.dto.SendMessageDto;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.User;
import com.example.fintrack.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

import static com.example.fintrack.exception.BusinessErrorCodes.*;
import static com.example.fintrack.friend.FriendSpecification.*;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final FriendRepository friendRepository;
    private final UserProvider userProvider;
    private final LastReadMessageRepository lastReadMessageRepository;
    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;

    public void sendMessage(long chatId, SendMessageDto sendMessageDto) {
        User user = userProvider.getLoggedUser();

        Chat chat = chatRepository.findById(chatId).orElseThrow(CHAT_DOES_NOT_EXIST::getError);

        if (!chat.getIsStarted()) {
            chat.setIsStarted(true);

            chat = chatRepository.save(chat);
        }

        ZonedDateTime now = ZonedDateTime.now();

        Message message = new Message();
        message.setSentBy(user);
        message.setChat(chat);
        message.setSendTime(now);
        message.setMessageType(MessageType.USER);
        message.setContent(sendMessageDto.message());

        Message savedMessage = messageRepository.save(message);

        LastReadMessage lastReadMessage = lastReadMessageRepository
                .findLastReadMessageByUserIdAndChatId(user.getId(), chatId)
                .orElseThrow(LAST_READ_MESSAGE_DOES_NOT_EXIST::getError);

        lastReadMessage.setMessage(savedMessage);
        lastReadMessage.setReadTime(now);

        List<Friend> friends = friendRepository.findFriendsByChatId(chatId);

        if(friends.size() > 2) {
            simpMessagingTemplate.convertAndSend("/topic/chats/" + chatId + "/message", MessageMapper.messageToMessageDto(savedMessage));
        } else {
            Friend friend = friends.stream()
                    .filter(s -> !Objects.equals(s.getUser().getId(), user.getId()))
                    .findFirst()
                    .orElseThrow(FRIEND_DOES_NOT_EXIST::getError);

            simpMessagingTemplate.convertAndSend("/topic/chats/" + chatId + "/private-chat-updates", MessageMapper.messageToPrivateMessageDto(savedMessage, lastReadMessage, friend));
        }

        lastReadMessageRepository.save(lastReadMessage);
    }

    public Page<PrivateChatDto> getPrivateChats(String search, int page, int size) {
        User user = userProvider.getLoggedUser();

        Specification<Friend> friendSpecification = hasUserId(user.getId()).and(hasFriendStatus(FriendStatus.ACCEPTED))
                .and(hasChatStarted(true));
        if (search != null) {
            friendSpecification = friendSpecification.and(hasFriendContainingText(search));
        }

        PageRequest pageRequest = PageRequest.of(page, size);

        Page<Friend> friends = friendRepository.findAll(friendSpecification, pageRequest);

        return friends.map(friend -> {
            LastReadMessage lastReadMessage = lastReadMessageRepository
                    .findLastReadMessageByUserIdAndChatId(user.getId(), friend.getChat().getId())
                    .orElseThrow(LAST_READ_MESSAGE_DOES_NOT_EXIST::getError);

            Message message = friend.getChat().getMessages().stream()
                    .max(Comparator.comparing(Message::getSendTime))
                    .orElseThrow(MESSAGE_DOES_NOT_EXIST::getError);

            return ChatMapper.friendToPrivateChatDto(friend, message, lastReadMessage);
        });
    }

    public void startTyping(long chatId) {
        User user = userProvider.getLoggedUser();

        MessageTypingDto startTypingDto = MessageTypingDto.builder()
                .userId(user.getId())
                .build();

        simpMessagingTemplate.convertAndSend("/topic/chats/" + chatId + "/user-started-typing", startTypingDto);
    }

    public void stopTyping(long chatId) {
        User user = userProvider.getLoggedUser();

        MessageTypingDto stopTypingDto = MessageTypingDto.builder()
                .userId(user.getId())
                .build();

        simpMessagingTemplate.convertAndSend("/topic/chats" + chatId + "/user-stopped-typing", stopTypingDto);
    }

    public void reportLastActivity(long chatId) {
        User user = userProvider.getLoggedUser();

        user.setLastSeenAt(ZonedDateTime.now());
        userRepository.save(user);

        simpMessagingTemplate.convertAndSend("/topic/chats" + chatId + "/user-last-activity", MessageMapper.messageToLastActivityDto(user));
    }

    public void updateLastReadMessage(long chatId, SendMessageDto sendMessageDto) {
        User user = userProvider.getLoggedUser();

        LastReadMessage lastReadMessage = lastReadMessageRepository
                .findLastReadMessageByUserIdAndChatId(user.getId(), chatId)
                .orElseThrow(LAST_READ_MESSAGE_DOES_NOT_EXIST::getError);

        Message message = lastReadMessage.getMessage();
        message.setContent(sendMessageDto.message());

        ZonedDateTime now = ZonedDateTime.now();

        lastReadMessage.setReadTime(now);
        lastReadMessage.setMessage(message);

        ReadMessageDto readMessageDto = MessageMapper.messageToReadMessageDto(user.getId(), lastReadMessage);

        simpMessagingTemplate.convertAndSend("/topic/chats/" + chatId + "/user-read-message", readMessageDto);

        lastReadMessageRepository.save(lastReadMessage);
    }

    public Page<MessageDto> getChatMessages(long messageId, long chatId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);

        Page<Message> messages = messageRepository.getMessagesByIdLessThanEqualAndChatId(messageId, chatId, pageRequest);

        return messages.map(MessageMapper::messageToMessageDto);
    }

    public ChatStateDto getChatState(long chatId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);

        Page<Message> messages = messageRepository.getFirstMessagesByChatId(chatId, pageRequest);

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

        Specification<Friend> friendSpecification = hasUserId(user.getId()).and(hasFriendStatus(FriendStatus.ACCEPTED))
                .and(hasChatStarted(true));

        List<Friend> friends = friendRepository.findAll(friendSpecification);

        return friends.stream()
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
