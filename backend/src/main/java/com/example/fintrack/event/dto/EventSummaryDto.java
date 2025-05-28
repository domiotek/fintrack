package com.example.fintrack.event.dto;

import lombok.Builder;

@Builder
public record EventSummaryDto(
        EventSummaryCurrencyDto eventCurrency,
        EventSummaryCurrencyDto userCurrency
) {
}
