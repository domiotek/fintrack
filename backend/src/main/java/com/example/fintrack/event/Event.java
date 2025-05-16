package com.example.fintrack.event;

import com.example.fintrack.currency.Currency;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class Event {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "currency_id", nullable = false)
    private Currency currency;

    @OneToMany(mappedBy = "event")
    private Set<UserEvent> users;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDateTime startDateTime;

    private LocalDateTime endDateTime;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Event event)) return false;
        return Objects.equals(id, event.id) && Objects.equals(currency, event.currency) &&
                Objects.equals(name, event.name) && Objects.equals(startDateTime, event.startDateTime) &&
                Objects.equals(endDateTime, event.endDateTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, currency, name, startDateTime, endDateTime);
    }
}
