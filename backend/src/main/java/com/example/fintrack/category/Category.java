package com.example.fintrack.category;

import com.example.fintrack.bill.Bill;
import com.example.fintrack.category.limit.Limit;
import com.example.fintrack.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Objects;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class Category {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "category")
    @ToString.Exclude
    private Set<Limit> limits;

    @OneToMany(mappedBy = "category")
    @ToString.Exclude
    private Set<Bill> bills;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String color;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Category category)) return false;
        return Objects.equals(id, category.id) && Objects.equals(user, category.user)
                && Objects.equals(name, category.name) && Objects.equals(color, category.color);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, user, name, color);
    }
}
