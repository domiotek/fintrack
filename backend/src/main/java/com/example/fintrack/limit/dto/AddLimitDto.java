package com.example.fintrack.limit.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record AddLimitDto(
        @NotNull
        BigDecimal amount
) {
}
