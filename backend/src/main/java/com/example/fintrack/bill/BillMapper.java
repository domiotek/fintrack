package com.example.fintrack.bill;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class BillMapper {

    public static EventBillDto billToBillDto(Bill bill) {
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
                .amount(bill.getAmount())
                .costPerUser(bill.getAmount().divide(
                        BigDecimal.valueOf(bill.getEvent().getUsers().size()), 2, RoundingMode.HALF_UP)
                )
                .build();
    }
}
