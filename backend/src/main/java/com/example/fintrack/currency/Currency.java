package com.example.fintrack.currency;

import com.example.fintrack.bill.Bill;
import com.example.fintrack.event.Event;
import com.example.fintrack.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class Currency {

    @Id
    @GeneratedValue
    private Long id;

    @OneToMany(mappedBy = "currency")
    @ToString.Exclude
    private Set<Rate> rates;

    @OneToMany(mappedBy = "currency")
    @ToString.Exclude
    private Set<User> users;

    @OneToMany(mappedBy = "currency")
    @ToString.Exclude
    private Set<Bill> bills;

    @OneToMany(mappedBy = "currency")
    @ToString.Exclude
    private Set<Event> events;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Currency currency = (Currency) o;
        return Objects.equals(id, currency.id) && Objects.equals(rates, currency.rates) &&
                Objects.equals(users, currency.users) && Objects.equals(bills, currency.bills) &&
                Objects.equals(events, currency.events) && Objects.equals(name, currency.name) &&
                Objects.equals(code, currency.code);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, rates, users, bills, events, name, code);
    }
}
