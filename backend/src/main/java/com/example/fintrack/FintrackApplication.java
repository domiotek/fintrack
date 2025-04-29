package com.example.fintrack;

import com.example.fintrack.currency.Currency;
import com.example.fintrack.currency.CurrencyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class FintrackApplication {

	public static void main(String[] args) {
		SpringApplication.run(FintrackApplication.class, args);
	}

	@Bean
	public CommandLineRunner init(
			final CurrencyRepository currencyRepository
	) {
		return args -> {
			Currency pln = new Currency();
			pln.setName("PLN");
			currencyRepository.save(pln);
		};
	}
}
