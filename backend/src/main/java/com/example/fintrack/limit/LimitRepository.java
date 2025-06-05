package com.example.fintrack.limit;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LimitRepository extends JpaRepository<Limit, Long> {

    Optional<Limit> findLimitByIdAndCategoryIdAndCategoryUserId(long limitId, long categoryId, long categoryUserId);
}
