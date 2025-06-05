package com.example.fintrack.message;

import com.example.fintrack.event.Event;
import com.example.fintrack.friend.Friend;
import com.example.fintrack.friendchatmessage.FriendChatMessage;
import com.example.fintrack.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.awt.*;
import java.time.ZonedDateTime;
import java.util.Objects;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Table(name="messages")
public class Message {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne
    @JoinColumn(name = "friend_chat_message_id")
    private FriendChatMessage friendChatMessage;

   @ManyToOne
   @JoinColumn(name = "user_id")
   private User user;

    @ManyToOne
    @JoinColumn(name = "friend_id")
    private Friend friend;

    @OneToMany(mappedBy = "message")
    @ToString.Exclude
    private Set<LastReadMessage> lastReadMessages;

    @Column(nullable = false)
    private String value;

    @Column(nullable = false)
    private TrayIcon.MessageType messageType;

    @Column(nullable = false)
    private ZonedDateTime sendTime;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Message message = (Message) o;
        return Objects.equals(id, message.id) && Objects.equals(event, message.event) && Objects.equals(user, message.user) && Objects.equals(friend, message.friend);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, event, user, friend);
    }
}
