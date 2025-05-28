package com.example.fintrack.category.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
public record LimitDto(BigDecimal amount,
                       LocalDateTime startDateTime,
                       LocalDateTime endDateTime) {
}
