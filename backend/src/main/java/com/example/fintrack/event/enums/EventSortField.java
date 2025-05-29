package com.example.fintrack.event.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EventSortField {
    NAME("event.name"),
    START_DATE("event.startDateTime"),
    END_DATE("event.endDateTime");

    private final String sortField;
}
