package com.example.fintrack.category.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AddCategoryDto(
        @NotBlank
        String name,
        @NotBlank
        String color
) {
}
