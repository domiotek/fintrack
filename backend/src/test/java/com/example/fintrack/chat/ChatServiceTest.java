package com.example.fintrack.chat;

import com.example.fintrack.friend.Friend;
import com.example.fintrack.friend.FriendRepository;
import com.example.fintrack.friend.FriendStatus;
import com.example.fintrack.lastreadmessage.LastReadMessage;
import com.example.fintrack.lastreadmessage.LastReadMessageRepository;
import com.example.fintrack.message.Message;
import com.example.fintrack.message.MessageRepository;
import com.example.fintrack.message.dto.SentMessageDto;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.User;
import com.example.fintrack.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class ChatServiceTest {

    @Mock private FriendRepository friendRepository;
    @Mock private UserProvider userProvider;
    @Mock private LastReadMessageRepository lastReadMessageRepository;
    @Mock private MessageRepository messageRepository;
    @Mock private SimpMessagingTemplate simpMessagingTemplate;
    @Mock private ChatRepository chatRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks private ChatService chatService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
    }

    @Test
    void shouldSendMessage() {
        SentMessageDto dto = new SentMessageDto(1L, "Hello!");
        Chat chat = new Chat();
        chat.setIsStarted(false);
        Friend friend = new Friend();
        friend.setFriendStatus(FriendStatus.ACCEPTED);

        LastReadMessage lrm = new LastReadMessage();
        lrm.setUser(user);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(friendRepository.findFriendsByChatId(anyLong())).thenReturn(List.of(friend));
        when(chatRepository.findById(anyLong())).thenReturn(Optional.of(chat));
        when(lastReadMessageRepository.findLastReadMessageByUserIdAndChatId(anyLong(), anyLong())).thenReturn(Optional.of(lrm));
        when(messageRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(lastReadMessageRepository.findLastReadMessagesByChatId(anyLong())).thenReturn(List.of(lrm));

        chatService.sendMessage(1L, dto);

        verify(simpMessagingTemplate, atLeastOnce()).convertAndSend(contains("/topic/chats/"), Optional.ofNullable(any()));
    }

    @Test
    void shouldThrowWhenFriendNotAccepted() {
        SentMessageDto dto = new SentMessageDto(1L, "Hi!");
        Friend friend = new Friend();
        friend.setFriendStatus(FriendStatus.PENDING);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(friendRepository.findFriendsByChatId(anyLong())).thenReturn(List.of(friend));

        chatService.sendMessage(1L, dto);

        verifyNoInteractions(messageRepository);
    }

    @Test
    void shouldStartTyping() {
        chatService.startTyping(1L, new com.example.fintrack.chat.dto.SentUserDto(1L));

        verify(simpMessagingTemplate).convertAndSend(contains("/topic/chats/"), Optional.ofNullable(any()));
    }

    @Test
    void shouldStopTyping() {
        chatService.stopTyping(1L, new com.example.fintrack.chat.dto.SentUserDto(1L));

        verify(simpMessagingTemplate).convertAndSend(contains("/topic/chats/"), Optional.ofNullable(any()));
    }

    @Test
    void shouldReportLastActivity() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        chatService.reportLastActivity(1L, new com.example.fintrack.chat.dto.SentUserDto(1L));

        verify(userRepository).save(user);
        verify(simpMessagingTemplate).convertAndSend(contains("/topic/chats/"), Optional.ofNullable(any()));
    }

    @Test
    void shouldThrowWhenUserNotFoundInReportLastActivity() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> chatService.reportLastActivity(1L, new com.example.fintrack.chat.dto.SentUserDto(1L)));
    }
}
