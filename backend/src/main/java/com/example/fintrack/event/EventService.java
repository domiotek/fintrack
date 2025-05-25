package com.example.fintrack.event;

import com.example.fintrack.event.dto.EventDto;
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

import java.time.LocalDateTime;

import static com.example.fintrack.userevent.UserEventSpecification.*;
import static org.springframework.data.jpa.domain.Specification.*;

@Service
@RequiredArgsConstructor
public class EventService {

    private final UserEventRepository userEventRepository;
    private final UserProvider userProvider;

    public PagedModel<EventDto> getEvents(
            String name, EventStatus eventStatus, LocalDateTime fromDate, LocalDateTime toDate, int page, int size
    ) {
        User loggedUser = userProvider.getLoggedUser();

        Specification<UserEvent> eventSpecification = where(hasUserId(loggedUser.getId()));
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
}
