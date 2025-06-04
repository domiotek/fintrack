package com.example.fintrack.bill;

import com.example.fintrack.bill.dto.AddBillDto;
import com.example.fintrack.bill.dto.BillDto;
import com.example.fintrack.bill.dto.EventBillDto;
import com.example.fintrack.bill.dto.EventBillUserDto;
import com.example.fintrack.category.Category;
import com.example.fintrack.category.dto.BillCategoryDto;
import com.example.fintrack.currency.Currency;
import com.example.fintrack.currency.CurrencyConverter;
import com.example.fintrack.event.dto.EventBillCurrencyDto;
import com.example.fintrack.user.User;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class BillMapper {

    public static EventBillDto billToEventBillDto(Bill bill, CurrencyConverter currencyConverter, User user) {
        BigDecimal amount = bill.getAmount();
        BigDecimal costPerUser = amount.divide(
                BigDecimal.valueOf(bill.getEvent().getUsers().size()), 2, RoundingMode.HALF_UP
        );

        BigDecimal amountInEventCurrency = currencyConverter
                .convertFromUSDToGivenCurrency(bill.getCurrency(), bill.getDate().toLocalDate(), amount);
        BigDecimal costPerUserInEventCurrency = currencyConverter
                .convertFromUSDToGivenCurrency(bill.getCurrency(), bill.getDate().toLocalDate(), costPerUser);

        BigDecimal amountInUserCurrency = currencyConverter
                .convertFromUSDToGivenCurrency(user.getCurrency(), bill.getDate().toLocalDate(), amount);
        BigDecimal costPerUserInUserCurrency = currencyConverter
                .convertFromUSDToGivenCurrency(user.getCurrency(), bill.getDate().toLocalDate(), costPerUser);

        return EventBillDto.builder()
                .id(bill.getId())
                .name(bill.getName())
                .date(bill.getDate())
                .paidBy(EventBillUserDto.builder()
                        .id(bill.getPaidBy().getId())
                        .firstName(bill.getPaidBy().getFirstName())
                        .lastName(bill.getPaidBy().getLastName())
                        .build()
                )
                .eventCurrency(EventBillCurrencyDto.builder()
                        .amount(amountInEventCurrency)
                        .costPerUser(costPerUserInEventCurrency)
                        .build()
                )
                .userCurrency(EventBillCurrencyDto.builder()
                        .amount(amountInUserCurrency)
                        .costPerUser(costPerUserInUserCurrency)
                        .build()
                )
                .build();
    }

    public static BillDto billToBillDto(Bill bill, CurrencyConverter currencyConverter, User user) {
        BigDecimal amountInUSD = currencyConverter.convertFromGivenCurrencyToUSD(bill.getCurrency(), bill.getAmount());
        BigDecimal userAmountInUsersCurrency = currencyConverter.convertFromUSDToGivenCurrency(user.getCurrency(), bill.getDate().toLocalDate(), amountInUSD);

        BillCategoryDto categoryDto = BillCategoryDto.builder()
                .id(bill.getCategory().getId())
                .name(bill.getCategory().getName())
                .build();

        return BillDto.builder()
                .id(bill.getId())
                .name(bill.getName())
                .category(categoryDto)
                .date(bill.getDate())
                .userValue(userAmountInUsersCurrency)
                .billValue(bill.getAmount())
                .currencyId(bill.getCurrency().getId())
                .build();
    }

    public static Bill addBillDtoToBill(AddBillDto addBillDto, Category category, Currency currency, User user) {
        Bill bill = new Bill();

        bill.setName(addBillDto.name());
        bill.setAmount(addBillDto.amount());
        bill.setCategory(category);
        bill.setCurrency(currency);
        bill.setDate(addBillDto.date());
        bill.setUser(user);

        return bill;
    }
}
