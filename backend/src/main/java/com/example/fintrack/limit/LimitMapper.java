package com.example.fintrack.limit;

import com.example.fintrack.category.Category;
import com.example.fintrack.currency.CurrencyConverter;
import com.example.fintrack.limit.dto.AddLimitDto;

import java.math.BigDecimal;

public class LimitMapper {

    public static Limit addLimitDtoToLimit(
            AddLimitDto addLimitDto, Category category, CurrencyConverter currencyConverter
    ) {
        Limit limit = new Limit();

        BigDecimal amountInUSD = currencyConverter
                .convertFromGivenCurrencyToUSD(category.getUser().getCurrency(), addLimitDto.amount());

        limit.setCategory(category);
        limit.setAmount(amountInUSD);
        limit.setStartDateTime(addLimitDto.startDateTime());
        limit.setEndDateTime(addLimitDto.endDateTime());

        return limit;
    }
}
