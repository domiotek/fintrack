package com.example.fintrack.limit;

import com.example.fintrack.category.Category;
import com.example.fintrack.limit.dto.AddLimitDto;
import com.example.fintrack.limit.dto.LimitDto;

public class LimitMapper {

    public static LimitDto limitToLimitDto(Limit limit) {
        return LimitDto.builder()
                .amount(limit.getAmount())
                .startDateTime(limit.getStartDateTime())
                .endDateTime(limit.getEndDateTime())
                .build();
    }

    public static Limit addLimitDtoToLimit(AddLimitDto addLimitDto, Category category) {
        Limit limit = new Limit();

        limit.setCategory(category);
        limit.setAmount(addLimitDto.amount());
        limit.setStartDateTime(addLimitDto.startDateTime());
        limit.setEndDateTime(addLimitDto.endDateTime());

        return limit;
    }
}
