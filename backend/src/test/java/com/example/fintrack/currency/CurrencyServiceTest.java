package com.example.fintrack.currency;

import com.example.fintrack.rate.Rate;
import com.example.fintrack.rate.RateMapper;
import com.example.fintrack.rate.RateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class CurrencyServiceTest {

    @Mock private RateRepository rateRepository;

    @InjectMocks private CurrencyService currencyService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldReturnCurrenciesWithLatestRate() {
        LocalDate now = LocalDate.now();
        ZonedDateTime startDate = now.atStartOfDay().atZone(ZoneId.systemDefault());
        ZonedDateTime endDate = startDate.plusDays(1);

        Rate rate = new Rate();
        when(rateRepository.findRatesByDateBetween(eq(startDate), eq(endDate))).thenReturn(List.of(rate));

        CurrencyDto dto = new CurrencyDto(1L, "Dollar", "USD", BigDecimal.TWO);
        mockStatic(RateMapper.class).when(() -> RateMapper.rateToCurrencyDto(rate)).thenReturn(dto);

        List<CurrencyDto> result = currencyService.getCurrenciesWithLatestRate();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).code()).isEqualTo("USD");
    }
}
