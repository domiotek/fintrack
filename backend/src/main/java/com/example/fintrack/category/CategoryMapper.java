package com.example.fintrack.category;

import com.example.fintrack.bill.Bill;
import com.example.fintrack.category.dto.AddCategoryDto;
import com.example.fintrack.category.dto.CategoryDto;
import com.example.fintrack.category.limit.LimitMapper;

import java.math.BigDecimal;

public class CategoryMapper {

    public static CategoryDto categoryToCategoryDto(Category category) {
        if(!category.getLimits().isEmpty()) {
            return CategoryDto.builder()
                    .id(category.getId())
                    .name(category.getName())
                    .color(category.getColor())
                    .limit(category.getLimits().stream().map(LimitMapper::limitToLimitDto).toList())
                    .userCosts(calculateCosts(category))
                    .build();
        } else {
            return CategoryDto.builder()
                    .id(category.getId())
                    .name(category.getName())
                    .color(category.getColor())
                    .limit(null)
                    .userCosts(0)
                    .build();
        }

    }

    public static Category addCategoryDtoToCategory(AddCategoryDto addCategoryDto) {
        Category category = new Category();
        category.setName(addCategoryDto.name());
        category.setColor(addCategoryDto.color());
        return category;
    }

    private static double calculateCosts(Category category) {
        if(!category.getBills().isEmpty()) {
            return category.getBills()
                    .stream()
                    .map(Bill::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .doubleValue();
        } else {
            return 0;
        }

    }
}
