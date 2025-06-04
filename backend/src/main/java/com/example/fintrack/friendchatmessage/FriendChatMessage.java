package com.example.fintrack.friendchatmessage;

import com.example.fintrack.friend.Friend;
import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Table(name = "friends_chat_messages")
public class FriendChatMessage {

    @Id
    @GeneratedValue
    private Long id;

    @OneToMany(mappedBy = "friendChatMessage")
    @ToString.Exclude
    private Set<Friend> friends;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FriendChatMessage that)) return false;
        return Objects.equals(id, that.id) && Objects.equals(friends, that.friends);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, friends);
    }
}
