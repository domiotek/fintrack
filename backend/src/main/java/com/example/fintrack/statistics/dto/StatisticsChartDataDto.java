package com.example.fintrack.statistics.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.util.List;

@Builder
public record StatisticsChartDataDto(
    List<String> labels,
    List<BigDecimal> data
) {
}
