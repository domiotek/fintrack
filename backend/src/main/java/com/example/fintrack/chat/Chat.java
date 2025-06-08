package com.example.fintrack.chat;

import com.example.fintrack.event.Event;
import com.example.fintrack.friend.Friend;
import com.example.fintrack.lastreadmessage.LastReadMessage;
import com.example.fintrack.message.Message;
import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class Chat {

    @Id
    @GeneratedValue
    private Long id;

    @OneToOne(mappedBy = "chat")
    private Event event;

    @OneToMany(mappedBy = "chat")
    @ToString.Exclude
    private Set<Friend> friends;

    @OneToMany(mappedBy = "chat")
    @ToString.Exclude
    private Set<Message> messages;

    @OneToMany(mappedBy = "chat")
    @ToString.Exclude
    private Set<LastReadMessage> lastReadMessages;

    @Column(nullable = false)
    private Boolean isStarted;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Chat chat)) return false;
        return Objects.equals(id, chat.id) && Objects.equals(event, chat.event);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, event);
    }
}
