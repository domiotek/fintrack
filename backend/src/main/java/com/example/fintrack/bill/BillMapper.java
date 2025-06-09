package com.example.fintrack.bill;

import com.example.fintrack.bill.dto.*;
import com.example.fintrack.category.Category;
import com.example.fintrack.category.dto.BillCategoryDto;
import com.example.fintrack.currency.Currency;
import com.example.fintrack.currency.CurrencyConverter;
import com.example.fintrack.event.Event;
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
        BigDecimal amount = bill.getAmount();

        BigDecimal amountInBillCurrency = currencyConverter
                .convertFromUSDToGivenCurrency(bill.getCurrency(), bill.getDate().toLocalDate(), amount);
        BigDecimal amountInUserCurrency = currencyConverter
                .convertFromUSDToGivenCurrency(user.getCurrency(), bill.getDate().toLocalDate(), amount);

        BillCategoryDto categoryDto = BillCategoryDto.builder()
                .id(bill.getCategory().getId())
                .name(bill.getCategory().getName())
                .color(bill.getCategory().getColor())
                .build();

        return BillDto.builder()
                .id(bill.getId())
                .name(bill.getName())
                .category(categoryDto)
                .date(bill.getDate())
                .userValue(amountInUserCurrency)
                .billValue(amountInBillCurrency)
                .currencyId(bill.getCurrency().getId())
                .build();
    }

    public static Bill addBillDtoToBill(
            AddBillDto addBillDto, Category category, Currency currency, User user, CurrencyConverter currencyConverter
    ) {
        BigDecimal amountInUSD = currencyConverter.convertFromGivenCurrencyToUSD(currency, addBillDto.amount());

        Bill bill = new Bill();

        bill.setName(addBillDto.name());
        bill.setAmount(amountInUSD);
        bill.setCategory(category);
        bill.setCurrency(currency);
        bill.setDate(addBillDto.date());
        bill.setUser(user);

        return bill;
    }

    public static Bill addBillEventDtoToBill(
            AddBillEventDto addBillEventDto, Category category, Event event, Currency currency, User user, CurrencyConverter currencyConverter
    ) {
        BigDecimal amountInUSD = currencyConverter.convertFromGivenCurrencyToUSD(currency, addBillEventDto.amount());

        Bill bill = new Bill();

        bill.setName(addBillEventDto.name());
        bill.setDate(addBillEventDto.date());
        bill.setAmount(amountInUSD);
        bill.setEvent(event);
        bill.setCurrency(currency);
        bill.setCategory(category);
        bill.setPaidBy(user);

        return bill;
    }
}
