package com.example.fintrack.bill.dto;

import com.example.fintrack.category.dto.BillCategoryDto;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record BillDto(
        Long id,
        String name,
        BillCategoryDto categoryDto,
        LocalDateTime date,
        BigDecimal userValue,
        BigDecimal billValue,
        Long currencyId
) {

}
