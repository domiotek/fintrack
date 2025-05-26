package com.example.fintrack.currency;

import com.example.fintrack.rate.Rate;
import com.example.fintrack.rate.RateMapper;
import com.example.fintrack.rate.RateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CurrencyService {

    private final RateRepository rateRepository;

    public List<CurrencyDto> getCurrenciesWithLatestRate() {
        List<Rate> rates = rateRepository.findCurrenciesWithLatestRate();

        return rates.stream()
                .map(RateMapper::rateToCurrencyDto)
                .toList();
    }
}
