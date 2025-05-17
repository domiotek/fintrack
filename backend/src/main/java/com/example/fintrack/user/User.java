package com.example.fintrack.user;

import com.example.fintrack.bill.Bill;
import com.example.fintrack.chat.UserChatConnection;
import com.example.fintrack.event.Event;
import com.example.fintrack.message.LastReadMessage;
import com.example.fintrack.category.Category;
import com.example.fintrack.currency.Currency;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.Accessors;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Accessors(chain = true)
public class User implements UserDetails {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "currency_id", nullable = false)
    private Currency currency;

    @OneToMany(mappedBy = "user")
    @ToString.Exclude
    private Set<Category> categories;

    @OneToMany(mappedBy =  "user")
    @ToString.Exclude
    Set<UserChatConnection> chats;

    @OneToMany(mappedBy = "user")
    @ToString.Exclude
    Set<LastReadMessage> lastReadMessages;

    @OneToMany(mappedBy = "user")
    @ToString.Exclude
    private Set<Bill> bills;

    @OneToMany(mappedBy = "paidBy")
    @ToString.Exclude
    private Set<Bill> paidBills;

    @ManyToMany
    @ToString.Exclude
    private Set<Event> events;

    @ManyToMany
    @JoinTable(
            name="friends",
            joinColumns=@JoinColumn(name="user_id"),
            inverseJoinColumns=@JoinColumn(name="user_friend_id")
    )
    @ToString.Exclude
    private Set<User> friends;

    @ManyToMany
    @JoinTable(
            name="friends",
            joinColumns=@JoinColumn(name="user_friend_id"),
            inverseJoinColumns=@JoinColumn(name="user_id")
    )
    @ToString.Exclude
    private Set<User> friendOf;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id) && Objects.equals(currency, user.currency) &&
                Objects.equals(categories, user.categories) && Objects.equals(chats, user.chats) &&
                Objects.equals(lastReadMessages, user.lastReadMessages) && Objects.equals(bills, user.bills) &&
                Objects.equals(paidBills, user.paidBills) && Objects.equals(events, user.events) &&
                Objects.equals(friends, user.friends) && Objects.equals(friendOf, user.friendOf) &&
                Objects.equals(firstName, user.firstName) && Objects.equals(lastName, user.lastName) &&
                Objects.equals(email, user.email) && Objects.equals(password, user.password);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, currency, categories, chats, lastReadMessages, bills, paidBills,
                events, friends, friendOf, firstName, lastName, email, password);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
