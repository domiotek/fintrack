package com.example.fintrack.friend;

import org.springframework.data.jpa.domain.Specification;

public class FriendSpecification {

    public static Specification<Friend> hasUserId(long userId) {
        return (root, query, builder) -> builder.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Friend> hasFriendContainingText(String text) {
        return (root, query, builder) -> builder.or(
                builder.like(builder.lower(root.get("friend").get("email")), "%" + text.toLowerCase() + "%"),
                builder.like(builder.lower(root.get("friend").get("firstName")), "%" + text.toLowerCase() + "%"),
                builder.like(builder.lower(root.get("friend").get("lastName")), "%" + text.toLowerCase() + "%")
        );
    }

    public static Specification<Friend> hasUserIdAndFriendId(long userId, long friendId) {
        return (root, query, builder) -> builder.or(
                builder.and(
                        builder.equal(root.get("user").get("id"), userId),
                        builder.equal(root.get("friend").get("id"), friendId)
                ),
                builder.and(
                        builder.equal(root.get("user").get("id"), friendId),
                        builder.equal(root.get("friend").get("id"), userId)
                )
        );
    }

    public static Specification<Friend> hasFriendStatus(FriendStatus friendStatus) {
        return (root, query, builder) -> builder.equal(root.get("friendStatus"), friendStatus);
    }
}
