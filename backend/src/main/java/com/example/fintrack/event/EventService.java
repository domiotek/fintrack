package com.example.fintrack.event;

import com.example.fintrack.bill.Bill;
import com.example.fintrack.event.dto.EventDto;
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
import java.util.Set;

import static com.example.fintrack.exception.BusinessErrorCodes.*;
import static com.example.fintrack.userevent.UserEventSpecification.*;

@Service
@RequiredArgsConstructor
public class EventService {

    private final UserEventRepository userEventRepository;
    private final EventRepository eventRepository;
    private final UserProvider userProvider;

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

    public EventSummaryDto getEventSummary(long eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow(EVENT_DOES_NOT_EXISTS::getError);

        BigDecimal totalSum = event.getBills().stream()
                .map(Bill::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal costPerUser = totalSum.divide(
                BigDecimal.valueOf(event.getUsers().size()), 2, RoundingMode.HALF_UP
        );

        return EventSummaryDto.builder()
                .totalSum(totalSum)
                .costPerUser(costPerUser)
                .build();
    }

    public void deleteUserFromEvent(long eventId, long userId) {
        Event event = eventRepository.findById(eventId).orElseThrow(EVENT_DOES_NOT_EXISTS::getError);

        Set<UserEvent> userEvents = event.getUsers();
        UserEvent userEvent = userEvents.stream()
                .filter(ue -> ue.getUser().getId() == userId)
                .findFirst()
                .orElseThrow(USER_DOES_NOT_EXISTS::getError);

        if (userEvent.getIsFounder()) {
            throw USER_IS_FOUNDER.getError();
        }

        User user = userEvent.getUser();

        List<User> usersWhoPaidForBills = event.getBills().stream()
                .map(Bill::getPaidBy)
                .distinct()
                .toList();

        if (usersWhoPaidForBills.contains(user)) {
            throw USER_ALREADY_PAID.getError();
        }

        userEventRepository.delete(userEvent);
    }

    public List<Long> getUsersWhoPaidInEvent(long eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow(EVENT_DOES_NOT_EXISTS::getError);

        List<User> users = new ArrayList<>(
                event.getBills().stream()
                        .map(Bill::getPaidBy)
                        .distinct()
                        .toList()
        );

        UserEvent userEvent = event.getUsers().stream()
                .filter(UserEvent::getIsFounder)
                .findFirst()
                .orElseThrow(USER_DOES_NOT_EXISTS::getError);

        User user = userEvent.getUser();
        if (!users.contains(user)) {
            users.add(user);
        }

        return users.stream()
                .map(User::getId)
                .toList();
    }
}
