package com.example.fintrack.rate;

import com.example.fintrack.currency.Currency;
import com.example.fintrack.currency.CurrencyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.*;

class RateServiceTest {

    private RateRepository rateRepository;
    private CurrencyRepository currencyRepository;
    private RateService rateService;

    @BeforeEach
    void setUp() {
        rateRepository = mock(RateRepository.class);
        currencyRepository = mock(CurrencyRepository.class);

        rateService = new RateService(rateRepository, currencyRepository) {
            public RatesDto fetchRates() {
                return new RatesDto(
                        BigDecimal.ONE,
                        "USD",
                        LocalDate.now(),
                        Map.of(
                                "USD", BigDecimal.ONE,
                                "EUR", BigDecimal.valueOf(0.91),
                                "PLN", BigDecimal.valueOf(4.25)
                        )
                );
            }
        };
    }

    @Test
    void shouldSaveRatesCorrectly() {
        Currency usd = new Currency(); usd.setCode("USD");
        Currency eur = new Currency(); eur.setCode("EUR");

        when(currencyRepository.findAll()).thenReturn(List.of(usd, eur));

        var service = new TestableRateService(rateRepository, currencyRepository);
        service.invokeUpdateRates();

        verify(rateRepository).saveAll(argThat((List<Rate> rates) ->
                rates.size() == 2 &&
                        rates.stream().anyMatch(rate -> "USD".equals(rate.getCurrency().getCode()) &&
                                rate.getAmount().compareTo(BigDecimal.ONE) == 0) &&
                        rates.stream().anyMatch(rate -> "EUR".equals(rate.getCurrency().getCode()) &&
                                rate.getAmount().compareTo(BigDecimal.valueOf(0.91).setScale(4, RoundingMode.HALF_UP)) == 0)
        ));

    }


    class TestableRateService extends RateService {
        public TestableRateService(RateRepository rateRepository, CurrencyRepository currencyRepository) {
            super(rateRepository, currencyRepository);
        }

        public RatesDto fetchRates() {
            return new RatesDto(
                    BigDecimal.ONE,
                    "USD",
                    LocalDate.now(),
                    Map.of("USD", BigDecimal.ONE, "EUR", BigDecimal.valueOf(0.91))
            );
        }

        // udostępniamy prywatną logikę do testu
        public void invokeUpdateRates() {
            super.updateRates(); // <-- wywołujemy metodę z klasy bazowej (działa, bo mamy dostęp przez dziedziczenie)
        }
    }

}
