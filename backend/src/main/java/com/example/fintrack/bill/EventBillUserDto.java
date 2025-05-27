package com.example.fintrack.bill;

import lombok.Builder;

@Builder
public record EventBillUserDto(
        Long id,
        String firstname,
        String lastname
) {
}
