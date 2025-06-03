package com.example.fintrack.category.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record CategoryDto(
        String name,
        String color,
        List<LimitDto> limitDto,
        double userCosts) {
}
