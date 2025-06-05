package com.example.fintrack.lastreadmessage;

import com.example.fintrack.chat.Chat;
import com.example.fintrack.message.Message;
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
@Table(name="last_read_message")
public class LastReadMessage {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "message_id", nullable = false)
    private Message message;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "chat_id")
    private Chat chat;

    @Column(nullable = false)
    private ZonedDateTime readTime;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LastReadMessage that)) return false;
        return Objects.equals(id, that.id) && Objects.equals(message, that.message) &&
                Objects.equals(user, that.user) && Objects.equals(chat, that.chat) &&
                Objects.equals(readTime, that.readTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, message, user, chat, readTime);
    }
}
