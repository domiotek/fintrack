package com.example.fintrack.category;

import com.example.fintrack.category.dto.AddCategoryDto;
import com.example.fintrack.category.dto.CategoryDto;
import com.example.fintrack.category.dto.UpdateCategoryDto;
import com.example.fintrack.limit.LimitService;
import com.example.fintrack.limit.dto.AddLimitDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final LimitService limitService;

    @GetMapping
    public ResponseEntity<Page<CategoryDto>> getCategories(
            @RequestParam(required = false) String name,
            @RequestParam ZonedDateTime from,
            @RequestParam ZonedDateTime to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok().body(categoryService.getCategories(name, from, to,  page, size));
    }

    @PostMapping
    public ResponseEntity<Void> addCategory(@RequestBody AddCategoryDto addCategoryDto) {
        categoryService.addCategory(addCategoryDto);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{category-id}")
    public ResponseEntity<Void> updateCategory(
            @PathVariable("category-id") long categoryId,
            @RequestBody UpdateCategoryDto updateCategoryDto
    ) {
        categoryService.updateCategory(categoryId, updateCategoryDto);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{category-id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable("category-id") long categoryId) {
        categoryService.deleteCategory(categoryId);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{category-id}/limits")
    public ResponseEntity<Void> addLimitToCategory(
            @PathVariable("category-id") long categoryId,
            @RequestBody @Valid AddLimitDto addLimitDto
    ) {
        limitService.addLimit(categoryId, addLimitDto);

        return ResponseEntity.noContent().build();
    }
}
