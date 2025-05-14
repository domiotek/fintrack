package com.example.fintrack;

import com.example.fintrack.currency.Currency;
import com.example.fintrack.currency.CurrencyRepository;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private CurrencyRepository currencyRepository;

    @Override
    public void run(String... args) {
        Currency pln = new Currency();
        pln.setName("PLN");
        currencyRepository.save(pln);
    }
}
