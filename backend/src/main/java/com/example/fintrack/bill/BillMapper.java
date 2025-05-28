package com.example.fintrack.bill;

import com.example.fintrack.bill.dto.EventBillDto;
import com.example.fintrack.bill.dto.EventBillUserDto;
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
                        .firstname(bill.getPaidBy().getFirstName())
                        .lastname(bill.getPaidBy().getLastName())
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
}
