package com.example.fintrack.message;

import com.example.fintrack.chat.Chat;
import com.example.fintrack.lastreadmessage.LastReadMessage;
import com.example.fintrack.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

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
    @JoinColumn(name = "chat_id")
    private Chat chat;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User sentBy;

    @OneToMany(mappedBy = "message")
    @ToString.Exclude
    private Set<LastReadMessage> lastReadMessages;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private MessageType messageType;

    @Column(nullable = false)
    private ZonedDateTime sendTime;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Message message)) return false;
        return Objects.equals(id, message.id) && Objects.equals(chat, message.chat) &&
                Objects.equals(sentBy, message.sentBy) && Objects.equals(content, message.content) &&
                messageType == message.messageType && Objects.equals(sendTime, message.sendTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, chat, sentBy, content, messageType, sendTime);
    }
}
