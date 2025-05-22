package com.example.fintrack.currency;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CurrencyService {

    private final CurrencyRepository currencyRepository;

    public List<CurrencyDto> getCurrencies() {
        List<Currency> currencies = currencyRepository.findAll();
        return currencies.stream()
                .map(currency -> CurrencyDto.builder()
                        .id(currency.getId())
                        .name(currency.getName())
                        .code(currency.getCode())
                        .build()
                )
                .toList();
    }
}
