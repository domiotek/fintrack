package com.example.fintrack.event;

import com.example.fintrack.event.dto.EventDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<PagedModel<EventDto>> getEvents(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) EventStatus eventStatus,
            @RequestParam(required = false) LocalDateTime fromDate,
            @RequestParam(required = false) LocalDateTime toDate,
            @RequestParam int page,
            @RequestParam int size
    ) {
        return ResponseEntity.ok().body(eventService.getEvents(name, eventStatus, fromDate, toDate, page, size));
    }
}
