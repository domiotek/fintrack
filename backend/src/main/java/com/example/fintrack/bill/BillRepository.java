package com.example.fintrack.bill;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface BillRepository extends JpaRepository<Bill, Long>, JpaSpecificationExecutor<Bill> {

    Page<Bill> findBillsByEventId(long eventId, Pageable pageable);

    List<Bill> findBillsByEventId(long eventId);

    List<Bill> findBillsByUserIdAndCategoryId(long userId, long categoryId);

    Optional<Bill> findBillByIdAndUserId(long billId, long userId);

    Optional<Bill> findBillByIdAndEventId(long billId, long eventId);
}
