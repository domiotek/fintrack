package com.example.fintrack.user;

import com.example.fintrack.user.dto.UserProfileCurrencyDto;
import com.example.fintrack.user.dto.UserProfileDto;

public class UserMapper {

    public static UserProfileDto userToUserProfileDto(User user) {
        UserProfileCurrencyDto userProfileCurrencyDto = UserProfileCurrencyDto.builder()
                .id(user.getCurrency().getId())
                .name(user.getCurrency().getName())
                .code(user.getCurrency().getCode())
                .build();
        return UserProfileDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .currency(userProfileCurrencyDto)
                .build();
    }
}
