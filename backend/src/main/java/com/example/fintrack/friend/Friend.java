package com.example.fintrack.friend;

import com.example.fintrack.friendchatmessage.FriendChatMessage;
import com.example.fintrack.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.ZonedDateTime;
import java.util.Objects;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Table(name = "friends")
public class Friend {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable=false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "friend_id", nullable=false)
    private User friend;

    @ManyToOne
    @JoinColumn(name = "friend_chat_message_id")
    private FriendChatMessage friendChatMessage;

    @Column(nullable = false)
    private ZonedDateTime createdAt;

    @Column(nullable = false)
    private FriendStatus friendStatus;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Friend friend1)) return false;
        return Objects.equals(id, friend1.id) && Objects.equals(user, friend1.user) &&
                Objects.equals(friend, friend1.friend) && Objects.equals(createdAt, friend1.createdAt) &&
                friendStatus == friend1.friendStatus;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, user, friend, createdAt, friendStatus);
    }
}
