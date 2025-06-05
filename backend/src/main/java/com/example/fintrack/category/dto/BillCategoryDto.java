package com.example.fintrack.category.dto;

import lombok.Builder;

@Builder
public record BillCategoryDto(
        Long id,
        String name,
        String color
) {
}
