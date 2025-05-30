package com.example.fintrack.utils;

import org.springframework.data.domain.Sort;

public enum SortDirection {
    ASC,
    DESC;

    public Sort.Direction toSortDirection() {
        return this == ASC ? Sort.Direction.ASC : Sort.Direction.DESC;
    }
}
