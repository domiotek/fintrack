package com.example.fintrack.category.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record CategoryDto(
        Long id,
        String name,
        String color,
        List<LimitDto> limit,
        double userCosts) {
}
