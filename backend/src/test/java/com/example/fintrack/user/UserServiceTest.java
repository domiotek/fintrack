package com.example.fintrack.user;

import com.example.fintrack.bill.BillRepository;
import com.example.fintrack.currency.Currency;
import com.example.fintrack.currency.CurrencyRepository;
import com.example.fintrack.event.Event;
import com.example.fintrack.event.EventRepository;
import com.example.fintrack.lastreadmessage.LastReadMessageRepository;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.dto.UpdateProfileDto;
import com.example.fintrack.userevent.UserEvent;
import com.example.fintrack.userevent.UserEventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock private UserRepository userRepository;
    @Mock UserEventRepository userEventRepository;
    @Mock private EventRepository eventRepository;
    @Mock private UserProvider userProvider;
    @Mock private BillRepository billRepository;
    @Mock private CurrencyRepository currencyRepository;
    @Mock private LastReadMessageRepository lastReadMessageRepository;

    @InjectMocks private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
        when(userProvider.getLoggedUser()).thenReturn(user);
    }

    @Test
    void shouldUpdateProfileInfo() {
        UpdateProfileDto dto = new UpdateProfileDto("John", "Doe", 1L);
        Currency currency = new Currency();
        when(currencyRepository.findById(1L)).thenReturn(Optional.of(currency));

        userService.updateProfileInfo(dto);

        verify(userRepository).save(user);
        assertEquals("John", user.getFirstName());
        assertEquals("Doe", user.getLastName());
        assertEquals(currency, user.getCurrency());
    }

    @Test
    void shouldAddUserToEvent() {
        Event event = new Event();
        event.setUsers(new HashSet<>());
        User newUser = new User();
        newUser.setId(2L);

        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(userRepository.findById(2L)).thenReturn(Optional.of(newUser));

        userService.addUserToEvent(1L, 2L);

        verify(userEventRepository).save(any(UserEvent.class));
        verify(lastReadMessageRepository).save(any());
    }

    @Test
    void shouldDeleteUserFromEvent() {
        Event event = new Event(); event.setId(1L);
        User userToDelete = new User(); userToDelete.setId(2L);
        UserEvent userEvent = new UserEvent();
        userEvent.setIsFounder(false);
        userEvent.setUser(userToDelete);
        userEvent.setEvent(event);

        when(userEventRepository.findUserEventByUserIdAndEventId(2L, 1L)).thenReturn(Optional.of(userEvent));
        when(billRepository.findBillsByEventId(1L)).thenReturn(List.of());

        userService.deleteUserFromEvent(1L, 2L);

        verify(userEventRepository).delete(userEvent);
    }
}
