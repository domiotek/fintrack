package com.example.fintrack.bill;

import com.example.fintrack.currency.Currency;
import com.example.fintrack.user.User;
import com.example.fintrack.category.Category;
import com.example.fintrack.event.Event;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class BillRepositoryTest {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private TestEntityManager entityManager;

    private User user;
    private Category category;
    private Event event;

    private Bill savedBill;

    @BeforeEach
    void setUp() {
        // 1. Wstaw wymagane obiekty wspólne
        Currency currency = entityManager.persist(new Currency());
        currency.setName("zloty");
        currency.setCode("PLN");
        user = new User();
        user.setEmail("a@b.pl");
        user.setFirstName("Jan");
        user.setLastName("Kowalski");
        user.setPassword("pass");
        user.setCurrency(currency);
        user = entityManager.persist(user);
        Category category1 = new Category();
        category1.setName("Kategoria");
        category1.setIsDefault(false);
        category1.setColor("#FFFFFF");
        category1.setUser(user);
        category = entityManager.persist(category1);
        event = entityManager.persist(new Event());

        // 2. Wstaw fakturę/bill
        Bill bill = new Bill();
        bill.setUser(user);
        bill.setCategory(category);
        bill.setEvent(event);
        bill.setCurrency(currency);
        bill.setAmount(BigDecimal.valueOf(100));
        bill.setName("Test Bill");
        bill.setDate(ZonedDateTime.now());
        savedBill = entityManager.persist(bill);
        entityManager.flush();
    }


    @Test
    void shouldFindBillsByEventId() {
        List<Bill> result = billRepository.findBillsByEventId(event.getId());

        assertThat(result).hasSize(1);
        assertThat(result.get(0)).isEqualTo(savedBill);
    }

    @Test
    void shouldFindBillsByUserIdAndCategoryId() {
        List<Bill> result = billRepository.findBillsByUserIdAndCategoryId(user.getId(), category.getId());

        assertThat(result).hasSize(1);
    }

    @Test
    void shouldFindBillByIdAndUserId() {
        Optional<Bill> result = billRepository.findBillByIdAndUserId(savedBill.getId(), user.getId());

        assertThat(result).isPresent();
    }

    @Test
    void shouldFindBillsByEventIdWithPagination() {
        var page = billRepository.findBillsByEventId(event.getId(), PageRequest.of(0, 10));

        assertThat(page.getTotalElements()).isEqualTo(1);
    }

    @Test
    void shouldFindBillByIdAndEventId() {
        Optional<Bill> result = billRepository.findBillByIdAndEventId(savedBill.getId(), event.getId());

        assertThat(result).isPresent();
    }
}
