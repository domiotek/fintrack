package com.example.fintrack.category.dto;

import com.example.fintrack.limit.dto.LimitDto;
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
