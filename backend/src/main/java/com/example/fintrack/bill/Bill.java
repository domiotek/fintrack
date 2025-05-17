package com.example.fintrack.bill;

import com.example.fintrack.category.Category;
import com.example.fintrack.currency.Currency;
import com.example.fintrack.event.Event;
import com.example.fintrack.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class Bill {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "currency_id", nullable = false)
    private Currency currency;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "paid_by", nullable = false)
    private User paidBy;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    private double amount;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Bill bill = (Bill) o;
        return Double.compare(amount, bill.amount) == 0 && Objects.equals(id, bill.id) &&
                Objects.equals(currency, bill.currency) && Objects.equals(category, bill.category) &&
                Objects.equals(event, bill.event) && Objects.equals(user, bill.user) &&
                Objects.equals(paidBy, bill.paidBy) && Objects.equals(name, bill.name) &&
                Objects.equals(date, bill.date);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, currency, category, event, user, paidBy, name, date, amount);
    }

}
