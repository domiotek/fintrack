package com.example.fintrack.category.dto;

import jakarta.validation.constraints.NotBlank;

public record AddCategoryDto(
        @NotBlank
        String name,
        @NotBlank
        String color
) {
}
