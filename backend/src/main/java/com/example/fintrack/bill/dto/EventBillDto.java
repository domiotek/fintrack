package com.example.fintrack.bill.dto;

import com.example.fintrack.event.dto.EventBillCurrencyDto;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record EventBillDto(
        Long id,
        String name,
        LocalDateTime date,
        EventBillUserDto paidBy,
        EventBillCurrencyDto eventCurrency,
        EventBillCurrencyDto userCurrency
) {
}
