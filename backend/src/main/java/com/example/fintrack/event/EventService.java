package com.example.fintrack.event;

import com.example.fintrack.bill.Bill;
import com.example.fintrack.currency.Currency;
import com.example.fintrack.currency.CurrencyConverter;
import com.example.fintrack.currency.CurrencyRepository;
import com.example.fintrack.event.dto.AddEventDto;
import com.example.fintrack.event.dto.EventDto;
import com.example.fintrack.event.dto.EventSummaryCurrencyDto;
import com.example.fintrack.event.dto.EventSummaryDto;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.User;
import com.example.fintrack.userevent.UserEvent;
import com.example.fintrack.userevent.UserEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.example.fintrack.exception.BusinessErrorCodes.*;
import static com.example.fintrack.userevent.UserEventSpecification.*;

@Service
@RequiredArgsConstructor
public class EventService {

    private final UserEventRepository userEventRepository;
    private final EventRepository eventRepository;
    private final UserProvider userProvider;
    private final CurrencyRepository currencyRepository;
    private final CurrencyConverter currencyConverter;

    public PagedModel<EventDto> getUserEvents(
            String name, EventStatus eventStatus, LocalDateTime fromDate, LocalDateTime toDate, int page, int size
    ) {
        User loggedUser = userProvider.getLoggedUser();

        Specification<UserEvent> eventSpecification = hasUserId(loggedUser.getId());
        if (name != null) {
            eventSpecification = eventSpecification.and(hasEventName(name));
        }
        if (eventStatus != null) {
            eventSpecification = eventSpecification.and(hasEventStatus(eventStatus));
        }
        if (fromDate != null) {
            eventSpecification = eventSpecification.and(hasEventStartedAfter(fromDate));
        }
        if (toDate != null) {
            eventSpecification = eventSpecification.and(hasEventStartedBefore(toDate));
        }

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("event.startDateTime").ascending());
        Page<UserEvent> userEvents = userEventRepository.findAll(eventSpecification, pageRequest);

        return new PagedModel<>(userEvents.map(EventMapper::userEventToEventDto));
    }

    public void addEvent(AddEventDto addEventDto) {
        Currency currency = currencyRepository.findById(addEventDto.currencyId())
                .orElseThrow(CURRENCY_DOES_NOT_EXIST::getError);

        Event event = new Event();
        event.setName(addEventDto.name());
        event.setCurrency(currency);
        event.setStartDateTime(addEventDto.startDate());
        event.setEndDateTime(addEventDto.endDate());

        eventRepository.save(event);

        User user = userProvider.getLoggedUser();

        UserEvent userEvent = new UserEvent();
        userEvent.setEvent(event);
        userEvent.setUser(user);
        userEvent.setIsFounder(true);

        userEventRepository.save(userEvent);
    }

    public EventSummaryDto getEventSummary(long eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow(EVENT_DOES_NOT_EXIST::getError);
        User user = userProvider.getLoggedUser();

        BigDecimal totalSum = event.getBills().stream()
                .map(Bill::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal costPerUser = totalSum.divide(
                BigDecimal.valueOf(event.getUsers().size()), 2, RoundingMode.HALF_UP
        );

        BigDecimal totalSumInEventCurrency = currencyConverter
                .convertFromUSDToGivenCurrency(event.getCurrency(), event.getStartDateTime().toLocalDate(), totalSum);
        BigDecimal totalCostPerUserInEventCurrency = currencyConverter
                .convertFromUSDToGivenCurrency(event.getCurrency(), event.getStartDateTime().toLocalDate(), costPerUser);

        BigDecimal totalSumInUserCurrency = currencyConverter
                .convertFromUSDToGivenCurrency(user.getCurrency(), event.getStartDateTime().toLocalDate(), totalSum);
        BigDecimal totalCostPerUserInUserCurrency = currencyConverter
                .convertFromUSDToGivenCurrency(event.getCurrency(), event.getStartDateTime().toLocalDate(), costPerUser);

        return EventSummaryDto.builder()
                .eventCurrency(EventSummaryCurrencyDto.builder()
                        .totalSum(totalSumInEventCurrency)
                        .costPerUser(totalCostPerUserInEventCurrency)
                        .build()
                )
                .userCurrency(EventSummaryCurrencyDto.builder()
                        .totalSum(totalSumInUserCurrency)
                        .costPerUser(totalCostPerUserInUserCurrency)
                        .build()
                )
                .build();
    }

    public List<Long> getUsersWhoPaidInEvent(long eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow(EVENT_DOES_NOT_EXIST::getError);

        List<User> users = new ArrayList<>(
                event.getBills().stream()
                        .map(Bill::getPaidBy)
                        .distinct()
                        .toList()
        );

        UserEvent userEvent = event.getUsers().stream()
                .filter(UserEvent::getIsFounder)
                .findFirst()
                .orElseThrow(USER_DOES_NOT_EXIST::getError);

        User user = userEvent.getUser();
        if (!users.contains(user)) {
            users.add(user);
        }

        return users.stream()
                .map(User::getId)
                .toList();
    }
}
