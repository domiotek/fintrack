package com.example.fintrack.category;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long>, JpaSpecificationExecutor<Category> {

    Optional<Category> findCategoryByIdAndUserId(long categoryId, long userId);

    List<Category> findCategoryByUserIdAndIsDefault(long userId, boolean isDefault);

    boolean existsCategoryByNameIgnoringCaseAndUserId(String name, long userId);

    @Query("""
    SELECT c FROM Category c
    LEFT JOIN c.bills b
    WHERE c.user.id = :userId
    AND (LOWER(c.name) LIKE CONCAT('%', LOWER(:name), '%') OR :name IS NULL)
    GROUP BY c.id
    ORDER BY COALESCE(SUM(b.amount), 0) DESC
    """)
    Page<Category> findCategoriesByUserIdAndNameSortedByMostSpendingDescending(@Param("userId") long userId, @Param("name") String name, Pageable pageable);
}
