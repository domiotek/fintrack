package com.example.fintrack.rate;

import com.example.fintrack.currency.CurrencyDto;

public class RateMapper {

    public static CurrencyDto rateToCurrencyDto(Rate rate) {
        return CurrencyDto.builder()
                .id(rate.getCurrency().getId())
                .name(rate.getCurrency().getName())
                .code(rate.getCurrency().getCode())
                .rate(rate.getAmount())
                .build();
    }
}
