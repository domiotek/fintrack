package com.example.fintrack.rate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

public record RatesDto(
        BigDecimal amount,
        String base,
        LocalDate date,
        Map<String, BigDecimal> rates
) {
}
