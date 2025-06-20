package com.example.fintrack.event;

import com.example.fintrack.bill.BillService;
import com.example.fintrack.bill.dto.AddBillEventDto;
import com.example.fintrack.bill.dto.EventBillDto;
import com.example.fintrack.bill.dto.UpdateBillEventDto;
import com.example.fintrack.event.dto.*;
import com.example.fintrack.event.enums.EventSortField;
import com.example.fintrack.event.enums.EventStatus;
import com.example.fintrack.user.UserService;
import com.example.fintrack.utils.enums.SortDirection;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final UserService userService;
    private final BillService billService;

    @GetMapping
    public ResponseEntity<Page<EventDto>> getUserEvents(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) EventStatus eventStatus,
            @RequestParam(required = false) ZonedDateTime from,
            @RequestParam(required = false) ZonedDateTime to,
            @RequestParam(defaultValue = "NAME") EventSortField sortField,
            @RequestParam(defaultValue = "ASC") SortDirection sortDirection,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok().body(eventService.getUserEvents(
                name, eventStatus, from, to, sortField, sortDirection, page, size
        ));
    }

    @GetMapping("/{event-id}/bills")
    public ResponseEntity<Page<EventBillDto>> getEventBills(
            @PathVariable("event-id") long eventId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok().body(billService.getEventBills(eventId, page, size));
    }

    @GetMapping("/{event-id}/summary")
    public ResponseEntity<EventSummaryDto> getEventSummary(@PathVariable("event-id") long eventId) {
        return ResponseEntity.ok().body(eventService.getEventSummary(eventId));
    }

    @PostMapping
    public ResponseEntity<Void> addEvent(@RequestBody @Valid AddEventDto addEventDto) {
        eventService.addEvent(addEventDto);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{event-id}")
    public ResponseEntity<Void> updateEvent(
            @PathVariable("event-id") long eventId,
            @RequestBody UpdateEventDto updateEventDto
    ) {
        eventService.updateEvent(eventId, updateEventDto);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{event-id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable("event-id") long eventId) {
        eventService.deleteEvent(eventId);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{event-id}/bills")
    public ResponseEntity<Void> addBillToEvent(
            @RequestBody @Valid AddBillEventDto addBillEventDto,
            @PathVariable("event-id") long eventId
    ) {
        billService.addBillToEvent(addBillEventDto, eventId);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{event-id}/bills/{bill-id}")
    public ResponseEntity<Void> updateBillInEvent(
            @PathVariable("event-id") long eventId,
            @PathVariable("bill-id") long billId,
            @RequestBody UpdateBillEventDto updateBillEventDto
    ) {
        billService.updateBillInEvent(eventId, billId, updateBillEventDto);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{event-id}/bills/{bill-id}")
    public ResponseEntity<Void> deleteBillFromEvent(
            @PathVariable("event-id") long eventId,
            @PathVariable("bill-id") long billId
    ) {
        billService.deleteBillFromEvent(eventId, billId);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{event-id}/users/{user-id}")
    public ResponseEntity<Void> addUserToEvent(
            @PathVariable("event-id") long eventId,
            @PathVariable("user-id") long userId
    ) {
        userService.addUserToEvent(eventId, userId);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{event-id}/users/{user-id}")
    public ResponseEntity<Void> deleteUserFromEvent(
            @PathVariable("event-id") long eventId,
            @PathVariable("user-id") long userId
    ) {
        userService.deleteUserFromEvent(eventId, userId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{event-id}/users-who-paid")
    public ResponseEntity<List<Long>> getUsersWhoPaid(@PathVariable("event-id") long eventId) {
        return ResponseEntity.ok().body(eventService.getUsersWhoPaidInEvent(eventId));
    }

    @GetMapping("/{event-id}/settlements")
    public ResponseEntity<List<SettlementDto>> getSettlements(@PathVariable("event-id") long eventId) {
        return ResponseEntity.ok().body(eventService.getSettlements(eventId));
    }
}
