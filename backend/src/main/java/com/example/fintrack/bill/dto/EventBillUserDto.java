package com.example.fintrack.bill.dto;

import lombok.Builder;

@Builder
public record EventBillUserDto(
        Long id,
        String firstName,
        String lastName
) {
}
