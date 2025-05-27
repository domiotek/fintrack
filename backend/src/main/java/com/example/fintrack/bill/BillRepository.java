package com.example.fintrack.bill;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillRepository extends JpaRepository<Bill, Long> {

    Page<Bill> findBillsByEventId(long id, Pageable pageable);
}
