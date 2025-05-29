package com.example.fintrack.category;

import com.example.fintrack.category.dto.AddCategoryDto;
import com.example.fintrack.category.dto.CategoryDto;
import com.example.fintrack.util.enums.SortDirection;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<Page<CategoryDto>> getCategories(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) LocalDateTime from,
            @RequestParam(required = false) LocalDateTime to,
            @RequestParam(required = false) SortDirection sortDirection,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok().body(categoryService.getCategories(name, from, to, sortDirection, page, size));
    }

    @PostMapping
    public ResponseEntity<Void> addCategory(
            @RequestBody @Valid AddCategoryDto categoryDto
    )  {
        categoryService.addCategory(categoryDto);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
