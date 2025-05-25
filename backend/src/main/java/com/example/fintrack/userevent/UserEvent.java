package com.example.fintrack.userevent;

import com.example.fintrack.event.Event;
import com.example.fintrack.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Objects;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class UserEvent {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private Boolean isFounder;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserEvent userEvent)) return false;
        return Objects.equals(id, userEvent.id) && Objects.equals(isFounder, userEvent.isFounder) &&
                Objects.equals(user, userEvent.user) && Objects.equals(event, userEvent.event);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, isFounder, user, event);
    }
}
