package com.example.fintrack.event;

import com.example.fintrack.bill.EventBillDto;
import com.example.fintrack.bill.BillService;
import com.example.fintrack.event.dto.EventDto;
import com.example.fintrack.event.dto.EventSummaryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final BillService billService;

    @GetMapping
    public ResponseEntity<PagedModel<EventDto>> getUserEvents(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) EventStatus eventStatus,
            @RequestParam(required = false) LocalDateTime fromDate,
            @RequestParam(required = false) LocalDateTime toDate,
            @RequestParam int page,
            @RequestParam int size
    ) {
        return ResponseEntity.ok().body(eventService.getUserEvents(name, eventStatus, fromDate, toDate, page, size));
    }

    @GetMapping("/{event-id}/bills")
    public ResponseEntity<PagedModel<EventBillDto>> getEventBills(
            @PathVariable("event-id") long eventId,
            @RequestParam int page,
            @RequestParam int size
    ) {
        return ResponseEntity.ok().body(billService.getEventBills(eventId, page, size));
    }

    @GetMapping("/{event-id}/summary")
    public ResponseEntity<EventSummaryDto> getEventSummary(@PathVariable("event-id") long eventId) {
        return ResponseEntity.ok().body(eventService.getEventSummary(eventId));
    }

    @PostMapping("/{event-id}/users/{user-id}")
    public ResponseEntity<Void> addUserToEvent(
            @PathVariable("event-id") long eventId,
            @PathVariable("user-id") long userId
    ) {
        eventService.addUserToEvent(eventId, userId);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{event-id}/users/{user-id}")
    public ResponseEntity<Void> deleteUserFromEvent(
            @PathVariable("event-id") long eventId,
            @PathVariable("user-id") long userId
    ) {
        eventService.deleteUserFromEvent(eventId, userId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{event-id}/users-who-paid")
    public ResponseEntity<List<Long>> getUsersWhoPaid(@PathVariable("event-id") long eventId) {
        return ResponseEntity.ok().body(eventService.getUsersWhoPaidInEvent(eventId));
    }
}
