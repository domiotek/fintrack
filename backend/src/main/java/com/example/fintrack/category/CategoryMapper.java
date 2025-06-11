package com.example.fintrack.category;

import com.example.fintrack.bill.Bill;
import com.example.fintrack.category.dto.AddCategoryDto;
import com.example.fintrack.category.dto.CategoryDto;
import com.example.fintrack.currency.CurrencyConverter;
import com.example.fintrack.user.User;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
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
                .isDefault(category.getIsDefault())
                .limit(getLatestLimitAmount(category, from, to, currencyConverter))
                .userCosts(calculateUserCosts(category, from, to, currencyConverter))
                .build();
    }

    public static Category addCategoryDtoToCategory(AddCategoryDto addCategoryDto, User user) {
        Category category = new Category();

        category.setName(addCategoryDto.name());
        category.setColor(addCategoryDto.color());
        category.setUser(user);
        category.setIsDefault(false);

        return category;
    }

    private static BigDecimal getLatestLimitAmount(
            Category category, ZonedDateTime from, ZonedDateTime to, CurrencyConverter currencyConverter
    ) {
        BigDecimal limitAmount = category.getLimits().stream()
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
                        category.getUser().getCurrency(), limit.getStartDateTime().toLocalDate(), limit.getAmount()
                ).setScale(2, RoundingMode.HALF_UP))
                .orElse(BigDecimal.ZERO);

        if (limitAmount.equals(BigDecimal.ZERO)) {
            return null;
        } else {
            return limitAmount;
        }
    }

    private static BigDecimal calculateUserCosts(
            Category category, ZonedDateTime from, ZonedDateTime to, CurrencyConverter currencyConverter
    ) {
        BigDecimal sum = category.getBills().stream()
                .filter(bill -> !bill.getDate().isBefore(from) && !bill.getDate().isAfter(to))
                .map(Bill::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return currencyConverter.convertFromUSDToGivenCurrency(category.getUser().getCurrency(), LocalDate.now(), sum)
                .setScale(2, RoundingMode.HALF_UP);
    }
}
