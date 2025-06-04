package com.example.fintrack.category;

import com.example.fintrack.category.dto.AddCategoryDto;
import com.example.fintrack.category.dto.CategoryDto;
import com.example.fintrack.currency.CurrencyConverter;
import com.example.fintrack.user.User;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

import static java.util.Comparator.*;

public class CategoryMapper {

    public static CategoryDto categoryToCategoryDto(
            Category category, ZonedDateTime from, ZonedDateTime to, CurrencyConverter currencyConverter
    ) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .color(category.getColor())
                .limit(getLatestLimitAmount(category, from, to, currencyConverter))
                .userCosts(calculateUserCosts(category, from, to, currencyConverter))
                .build();
    }

    public static Category addCategoryDtoToCategory(AddCategoryDto addCategoryDto, User user) {
        Category category = new Category();

        category.setName(addCategoryDto.name());
        category.setColor(addCategoryDto.color());
        category.setUser(user);

        return category;
    }

    private static BigDecimal getLatestLimitAmount(
            Category category, ZonedDateTime from, ZonedDateTime to, CurrencyConverter currencyConverter
    ) {
        return category.getLimits().stream()
                .filter(l -> {
                    if (!l.getStartDateTime().isAfter(to)) {
                        if (l.getEndDateTime() == null) {
                            return true;
                        }
                        return !l.getEndDateTime().isBefore(from);
                    }
                    return false;
                })
                .max(comparing(l -> {
                    if (l.getEndDateTime() != null) {
                        return l.getEndDateTime();
                    }
                    return l.getStartDateTime();
                }))
                .map(limit -> currencyConverter.convertFromUSDToGivenCurrency(
                        category.getUser().getCurrency(), from.toLocalDate(), limit.getAmount()
                ))
                .orElse(null);
    }

    private static BigDecimal calculateUserCosts(
            Category category, ZonedDateTime from, ZonedDateTime to, CurrencyConverter currencyConverter
    ) {
        return category.getBills().stream()
                .filter(bill -> !bill.getDate().isBefore(from) && !bill.getDate().isAfter(to))
                .map(bill -> currencyConverter.convertFromUSDToGivenCurrency(
                        category.getUser().getCurrency(), bill.getDate().toLocalDate(), bill.getAmount()
                ))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
