package com.example.fintrack.event;

import com.example.fintrack.bill.EventBillDto;
import com.example.fintrack.bill.BillService;
import com.example.fintrack.event.dto.EventDto;
import com.example.fintrack.event.dto.EventSummaryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

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

    @GetMapping("/{id}/bills")
    public ResponseEntity<PagedModel<EventBillDto>> getEventBills(
            @PathVariable long id,
            @RequestParam int page,
            @RequestParam int size
    ) {
        return ResponseEntity.ok().body(billService.getEventBills(id, page, size));
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<EventSummaryDto> getEventTotal(@PathVariable long id) {
        return ResponseEntity.ok().body(eventService.getEventTotal(id));
    }
}
