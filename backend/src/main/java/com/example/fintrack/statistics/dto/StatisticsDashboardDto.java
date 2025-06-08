package com.example.fintrack.statistics.dto;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record StatisticsDashboardDto(
        BigDecimal totalSpending,
        BigDecimal previousMonthDifference,
        StatisticsChartDataDto chartData
) {
}
