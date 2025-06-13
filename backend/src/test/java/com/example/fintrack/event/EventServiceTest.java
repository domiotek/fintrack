package com.example.fintrack.event;

import com.example.fintrack.bill.Bill;
import com.example.fintrack.chat.ChatRepository;
import com.example.fintrack.currency.Currency;
import com.example.fintrack.currency.CurrencyConverter;
import com.example.fintrack.currency.CurrencyRepository;
import com.example.fintrack.event.dto.AddEventDto;
import com.example.fintrack.lastreadmessage.LastReadMessageRepository;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.User;
import com.example.fintrack.user.UserRepository;
import com.example.fintrack.userevent.UserEvent;
import com.example.fintrack.userevent.UserEventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class EventServiceTest {

    @Mock private UserEventRepository userEventRepository;
    @Mock private EventRepository eventRepository;
    @Mock private UserProvider userProvider;
    @Mock private CurrencyRepository currencyRepository;
    @Mock private CurrencyConverter currencyConverter;
    @Mock private UserRepository userRepository;
    @Mock private ChatRepository chatRepository;
    @Mock private LastReadMessageRepository lastReadMessageRepository;

    @InjectMocks private EventService eventService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
        when(userProvider.getLoggedUser()).thenReturn(user);
    }

    @Test
    void shouldUpdateEvent() {
        Event event = new Event();
        Currency currency = new Currency();

        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(currencyRepository.findById(1L)).thenReturn(Optional.of(currency));

        eventService.updateEvent(1L, new com.example.fintrack.event.dto.UpdateEventDto("New Name", null, null, 1L));

        verify(eventRepository).save(event);
    }

    @Test
    void shouldDeleteEvent() {
        Event event = new Event();
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));

        eventService.deleteEvent(1L);

        verify(eventRepository).delete(event);
    }

    @Test
    void shouldGetUsersWhoPaidInEvent() {
        Event event = new Event();
        User paidBy = new User(); paidBy.setId(2L);
        User founder = new User(); founder.setId(3L);
        Bill bill = new Bill(); bill.setPaidBy(paidBy);

        event.setBills(Set.of(bill));

        UserEvent founderEvent = new UserEvent();
        founderEvent.setIsFounder(true);
        founderEvent.setUser(founder);
        event.setUsers(Set.of(founderEvent));

        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));

        var result = eventService.getUsersWhoPaidInEvent(1L);

        assert result.contains(2L);
        assert result.contains(3L);
    }
}
