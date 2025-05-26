package com.example.fintrack.rate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RateRepository extends JpaRepository<Rate, Long> {

    @Query("""
    SELECT r FROM Rate r WHERE r.date IN (SELECT MAX(r2.date) FROM Rate r2 WHERE r2.currency = r.currency)
    """)
    List<Rate> findCurrenciesWithLatestRate();
}
