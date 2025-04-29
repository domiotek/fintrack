package com.example.fintrack.currency;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class Rate {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "currency_id", nullable = false)
    private Currency currency;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private BigDecimal value;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Rate rate)) return false;
        return Objects.equals(id, rate.id) && Objects.equals(currency, rate.currency) &&
                Objects.equals(date, rate.date) && Objects.equals(value, rate.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, currency, date, value);
    }
}
