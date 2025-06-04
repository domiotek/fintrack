package com.example.fintrack.category.dto;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record CategoryDto(
        Long id,
        String name,
        String color,
        BigDecimal limit,
        BigDecimal userCosts
) {
}
