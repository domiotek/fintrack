package com.example.fintrack.chat;

import com.example.fintrack.chat.dto.ChatStateDto;
import com.example.fintrack.chat.dto.PrivateChatDto;
import com.example.fintrack.chat.dto.SentUserDto;
import com.example.fintrack.friend.Friend;
import com.example.fintrack.friend.FriendRepository;
import com.example.fintrack.friend.FriendStatus;
import com.example.fintrack.lastreadmessage.LastReadMessage;
import com.example.fintrack.lastreadmessage.LastReadMessageMapper;
import com.example.fintrack.lastreadmessage.LastReadMessageRepository;
import com.example.fintrack.lastreadmessage.dto.LastReadMessageDto;
import com.example.fintrack.lastreadmessage.dto.SentLastReadMessageDto;
import com.example.fintrack.message.Message;
import com.example.fintrack.message.MessageMapper;
import com.example.fintrack.message.MessageRepository;
import com.example.fintrack.message.MessageType;
import com.example.fintrack.message.dto.*;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.User;
import com.example.fintrack.user.UserRepository;
import com.example.fintrack.userevent.UserEvent;
import com.example.fintrack.userevent.UserEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;

import static com.example.fintrack.exception.BusinessErrorCodes.*;
import static com.example.fintrack.friend.FriendSpecification.*;
import static java.util.Comparator.comparing;

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
    private final UserEventRepository userEventRepository;

    public void sendMessage(long chatId, SentMessageDto sentMessageDto) {
        User user = userRepository.findById(sentMessageDto.userId()).orElseThrow(USER_DOES_NOT_EXIST::getError);

        List<Friend> friends = friendRepository.findFriendsByChatId(chatId);
        for (Friend friend : friends) {
            if (friend.getFriendStatus() != FriendStatus.ACCEPTED) {
                return;
            }
        }

        Chat chat = chatRepository.findById(chatId).orElseThrow(CHAT_DOES_NOT_EXIST::getError);
        if (!chat.getIsStarted()) {
            chat.setIsStarted(true);

            chat = chatRepository.save(chat);
        }

        ZonedDateTime now = ZonedDateTime.now();

        Message message = MessageMapper.messageDtoToMessage(user, chat, now, MessageType.USER, sentMessageDto.message());
        Message savedMessage =  messageRepository.save(message);

        simpMessagingTemplate.convertAndSend(
                "/topic/chats/" + chatId + "/message", MessageMapper.messageToMessageDto(message)
        );

        LastReadMessage lastReadMessage = lastReadMessageRepository
                .findLastReadMessageByUserIdAndChatId(user.getId(), chatId)
                .orElseThrow(LAST_READ_MESSAGE_DOES_NOT_EXIST::getError);

        lastReadMessage.setMessage(savedMessage);
        lastReadMessage.setReadTime(now);

        lastReadMessageRepository.save(lastReadMessage);

        List<LastReadMessage> lastReadMessages = lastReadMessageRepository.findLastReadMessagesByChatId(chatId);

        friends.forEach(friend -> {
            LastReadMessage userLastReadMessage = lastReadMessages.stream()
                    .filter(lrm -> lrm.getUser().equals(friend.getUser()))
                    .findFirst()
                    .orElseThrow(LAST_READ_MESSAGE_DOES_NOT_EXIST::getError);

            simpMessagingTemplate.convertAndSend(
                    "/topic/chats/" + friend.getUser().getId() + "/private-chat-updates",
                    ChatMapper.friendToPrivateChatDto(friend, message, userLastReadMessage)
            );
        });
    }

    public void sendPrivateChatUpdatesFriend(List<Friend> friends) {
        long chatId = friends.stream()
                .findFirst()
                .map(friend -> friend.getChat().getId())
                .orElseThrow(CHAT_DOES_NOT_EXIST::getError);

        Message latestMessage = messageRepository.findFirstByChatIdOrderByIdDesc(chatId)
                .orElseThrow(MESSAGE_DOES_NOT_EXIST::getError);

        List<LastReadMessage> lastReadMessages = lastReadMessageRepository.findLastReadMessagesByChatId(chatId);

        friends.forEach(friend -> {
            LastReadMessage userLastReadMessage = lastReadMessages.stream()
                    .filter(lrm -> lrm.getUser().equals(friend.getUser()))
                    .findFirst()
                    .orElseThrow(LAST_READ_MESSAGE_DOES_NOT_EXIST::getError);

            simpMessagingTemplate.convertAndSend(
                    "/topic/chats/" + friend.getUser().getId() + "/private-chat-updates",
                    ChatMapper.friendToPrivateChatDto(friend, latestMessage, userLastReadMessage)
            );
        });
    }

    public void startTyping(long chatId, SentUserDto sentUserDto) {
        MessageTypingDto startTypingDto = MessageMapper.messageToMessageTypingDto(sentUserDto.userId());

        simpMessagingTemplate.convertAndSend("/topic/chats/" + chatId + "/user-started-typing", startTypingDto);
    }

    public void stopTyping(long chatId, SentUserDto sentUserDto) {
        MessageTypingDto stopTypingDto = MessageMapper.messageToMessageTypingDto(sentUserDto.userId());

        simpMessagingTemplate.convertAndSend("/topic/chats/" + chatId + "/user-stopped-typing", stopTypingDto);
    }

    public void reportLastActivity(long chatId, SentUserDto sentUserDto) {
        User user = userRepository.findById(sentUserDto.userId()).orElseThrow(USER_DOES_NOT_EXIST::getError);

        user.setLastSeenAt(ZonedDateTime.now());
        userRepository.save(user);

        simpMessagingTemplate.convertAndSend("/topic/chats/" + chatId + "/user-last-activity", MessageMapper.userToLastActivityDto(user));
    }

    public void updateLastReadMessage(long chatId, SentLastReadMessageDto sentLastReadMessageDto) {
        User user = userRepository.findById(sentLastReadMessageDto.userId()).orElseThrow(USER_DOES_NOT_EXIST::getError);

        Message userReadMessage = messageRepository.findById(sentLastReadMessageDto.messageId())
                .orElseThrow(MESSAGE_DOES_NOT_EXIST::getError);

        LastReadMessage lastReadMessage = lastReadMessageRepository
                .findLastReadMessageByUserIdAndChatId(user.getId(), chatId)
                .orElseThrow(LAST_READ_MESSAGE_DOES_NOT_EXIST::getError);

        lastReadMessage.setMessage(userReadMessage);
        lastReadMessage.setReadTime(ZonedDateTime.now());

        LastReadMessage savedLastReadMessage = lastReadMessageRepository.save(lastReadMessage);

        ReadMessageDto readMessageDto = MessageMapper.messageToReadMessageDto(user.getId(), savedLastReadMessage);

        simpMessagingTemplate.convertAndSend("/topic/chats/" + chatId + "/user-read-message", readMessageDto);

        Message latestMessage = messageRepository.findFirstByChatIdOrderByIdDesc(chatId)
                .orElseThrow(MESSAGE_DOES_NOT_EXIST::getError);

        List<Friend> friends = friendRepository.findFriendsByChatId(chatId);
        if (!friends.isEmpty()) {
            Friend friend = friends.stream()
                    .filter(f -> f.getUser().equals(user))
                    .findFirst()
                    .orElseThrow(FRIEND_DOES_NOT_EXIST::getError);

            simpMessagingTemplate.convertAndSend(
                    "/topic/chats/" + friend.getUser().getId() + "/private-chat-updates",
                    ChatMapper.friendToPrivateChatDto(friend, latestMessage, lastReadMessage)
            );
        }
    }

    public Page<MessageDto> getChatMessages(long messageId, long chatId, int page, int size) {
        if (userNotBelongsToChat(chatId)) {
            throw CHAT_DOES_NOT_EXIST.getError();
        }

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("id").descending());

        Page<Message> messages = messageRepository.getMessagesByIdLessThanEqualAndChatId(messageId, chatId, pageRequest);

        return messages.map(MessageMapper::messageToMessageDto);
    }

    public Page<PrivateChatDto> getPrivateChats(String search, int page, int size) {
        User user = userProvider.getLoggedUser();

        PageRequest pageRequest = PageRequest.of(page, size);

        Page<Friend> friends = friendRepository
                .findFriendsByUserIdAndFriendsStatusesAndSearch(user.getId(), FriendStatus.ACCEPTED, FriendStatus.DELETED, search, pageRequest);

        return friends.map(friend -> {
            LastReadMessage lastReadMessage = lastReadMessageRepository
                    .findLastReadMessageByUserIdAndChatId(user.getId(), friend.getChat().getId())
                    .orElseThrow(LAST_READ_MESSAGE_DOES_NOT_EXIST::getError);

            Message message = friend.getChat().getMessages().stream()
                    .max(comparing(Message::getSendTime))
                    .orElseThrow(MESSAGE_DOES_NOT_EXIST::getError);

            return ChatMapper.friendToPrivateChatDto(friend, message, lastReadMessage);
        });
    }

    public ChatStateDto getChatState(long chatId, int page, int size) {
        if (userNotBelongsToChat(chatId)) {
            throw CHAT_DOES_NOT_EXIST.getError();
        }

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("id").descending());

        Page<Message> messages = messageRepository.getMessagesByChatId(chatId, pageRequest);

        Page<MessageDto> massagesDtos = messages.map(MessageMapper::messageToMessageDto);

        List<LastReadMessage> lastReadMessages = lastReadMessageRepository.findLastReadMessagesByChatId(chatId);

        List<LastReadMessageDto> userLastReadMessages = lastReadMessages.stream()
                .map(LastReadMessageMapper::lastReadMessageToLastReadMessageDto)
                .toList();

        Chat chat = chatRepository.findById(chatId).orElseThrow(CHAT_DOES_NOT_EXIST::getError);

        List<LastActivityDto> lastActivities;

        if (chat.getEvent() != null) {
            lastActivities = chat.getEvent().getUsers().stream()
                    .map(UserEvent::getUser)
                    .map(MessageMapper::userToLastActivityDto)
                    .toList();
        } else {
            lastActivities = chat.getFriends().stream()
                    .map(Friend::getUser)
                    .map(MessageMapper::userToLastActivityDto)
                    .toList();
        }

        return ChatStateDto.builder()
                .messages(massagesDtos)
                .lastReadMessages(userLastReadMessages)
                .lastActivities(lastActivities)
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

    private boolean userNotBelongsToChat(long chatId) {
        User user = userProvider.getLoggedUser();

        Chat chat = chatRepository.findById(chatId).orElseThrow(CHAT_DOES_NOT_EXIST::getError);

        if (chat.getEvent() != null) {
            return !userEventRepository.existsUserEventByUserIdAndEventId(user.getId(), chat.getEvent().getId());
        } else {
            return !friendRepository.existsFriendByUserIdAndChatId(user.getId(), chatId);
        }
    }
}
