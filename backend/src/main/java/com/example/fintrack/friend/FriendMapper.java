package com.example.fintrack.friend;

import com.example.fintrack.friend.dto.FriendDto;
import com.example.fintrack.friend.dto.FriendRequestDto;

public class FriendMapper {

    public static FriendDto userToFriendDto(Friend friend) {
        return FriendDto.builder()
                .id(friend.getFriend().getId())
                .email(friend.getFriend().getEmail())
                .firstName(friend.getFriend().getFirstName())
                .lastName(friend.getFriend().getLastName())
                .build();
    }

    public static FriendRequestDto userToFriendRequestDto(Friend friend) {
        return FriendRequestDto.builder()
                .id(friend.getFriend().getId())
                .email(friend.getFriend().getEmail())
                .firstName(friend.getFriend().getFirstName())
                .lastName(friend.getFriend().getLastName())
                .createdAt(friend.getCreatedAt())
                .build();
    }
}
