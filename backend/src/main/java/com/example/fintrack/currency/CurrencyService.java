package com.example.fintrack.currency;

import com.example.fintrack.rate.Rate;
import com.example.fintrack.rate.RateMapper;
import com.example.fintrack.rate.RateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CurrencyService {

    private final RateRepository rateRepository;

    public List<CurrencyDto> getCurrenciesWithLatestRate() {
        LocalDate now = LocalDate.now();
        LocalDateTime startDate = now.atStartOfDay();
        LocalDateTime endDate = startDate.plusDays(1);

        List<Rate> rates = rateRepository.findRatesByDateBetween(startDate, endDate);

        return rates.stream()
                .map(RateMapper::rateToCurrencyDto)
                .toList();
    }
}
