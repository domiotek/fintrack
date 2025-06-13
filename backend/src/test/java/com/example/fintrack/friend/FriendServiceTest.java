package com.example.fintrack.friend;

import com.example.fintrack.chat.ChatService;
import com.example.fintrack.friend.dto.SendFriendRequestDto;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Example;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class FriendServiceTest {

    @Mock private FriendRepository friendRepository;
    @Mock private UserProvider userProvider;
    @Mock private ChatService chatService;

    @InjectMocks private FriendService friendService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
        user.setEmail("user@example.com");
        when(userProvider.getLoggedUser()).thenReturn(user);
    }

    @Test
    void shouldRejectSelfFriendRequest() {
        SendFriendRequestDto dto = new SendFriendRequestDto("user@example.com");

        try {
            friendService.sendFriendRequest(dto);
        } catch (RuntimeException ignored) {}

        verify(friendRepository, never()).saveAll(any());
    }

    @Test
    void shouldAcceptFriendRequest() {
        Friend friend = new Friend();
        friend.setFriendStatus(FriendStatus.PENDING);

        when(friendRepository.findAll((Example<Friend>) any())).thenReturn(List.of(friend));

        friendService.acceptFriendRequest(2L, new com.example.fintrack.friend.dto.AcceptFriendRequest(true));

        verify(friendRepository).saveAll(any());
        verify(chatService).sendPrivateChatUpdatesFriend(any());
    }

    @Test
    void shouldDeleteFriendOnRejection() {
        Friend friend = new Friend();

        when(friendRepository.findAll((Example<Friend>) any())).thenReturn(List.of(friend));

        friendService.acceptFriendRequest(2L, new com.example.fintrack.friend.dto.AcceptFriendRequest(false));

        verify(friendRepository).saveAll(any());
        verify(chatService).sendPrivateChatUpdatesFriend(any());
    }

    @Test
    void shouldDeleteFriend() {
        Friend friend = new Friend();

        when(friendRepository.findAll((Example<Friend>) any())).thenReturn(List.of(friend));

        friendService.deleteFriend(2L);

        verify(friendRepository).saveAll(any());
        verify(chatService).sendPrivateChatUpdatesFriend(any());
    }
}
