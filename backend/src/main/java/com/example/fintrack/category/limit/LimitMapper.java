package com.example.fintrack.category.limit;

import com.example.fintrack.category.dto.LimitDto;

public class LimitMapper {

    public static LimitDto limitToLimitDto(Limit limit) {
        return LimitDto.builder()
                .amount(limit.getAmount())
                .startDateTime(limit.getStartDateTime())
                .endDateTime(limit.getEndDateTime())
                .build();
    }
}
