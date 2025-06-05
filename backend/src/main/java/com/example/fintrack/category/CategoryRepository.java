package com.example.fintrack.category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long>, JpaSpecificationExecutor<Category> {

    Optional<Category> findCategoryByIdAndUserId(long categoryId, long userId);

    List<Category> findCategoryByUserIdAndIsDefault(long userId, boolean isDefault);
}
