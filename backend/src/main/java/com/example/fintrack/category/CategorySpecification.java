package com.example.fintrack.category;

import org.springframework.data.jpa.domain.Specification;

public class CategorySpecification {

    public static Specification<Category> hasUserId(long userId) {
        return (root, query, builder) ->  builder.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Category> hasCategoryName(String categoryName) {
        return (root, query, builder) ->  builder.like(builder.lower(root.get("name")), "%" + categoryName.toLowerCase() + "%");
    }
}
