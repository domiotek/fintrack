package com.example.fintrack.limit;

import com.example.fintrack.category.Category;
import com.example.fintrack.currency.CurrencyConverter;
import com.example.fintrack.limit.dto.AddLimitDto;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public class LimitMapper {

    public static Limit addLimitDtoToLimit(
            AddLimitDto addLimitDto, Category category, CurrencyConverter currencyConverter, ZonedDateTime zonedDateTime
    ) {
        BigDecimal amountInUSD = currencyConverter
                .convertFromGivenCurrencyToUSD(category.getUser().getCurrency(), addLimitDto.amount());

        Limit limit = new Limit();

        limit.setCategory(category);
        limit.setAmount(amountInUSD);
        limit.setStartDateTime(zonedDateTime);

        return limit;
    }
}
