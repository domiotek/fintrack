package com.example.fintrack.category;

import com.example.fintrack.bill.Bill;
import com.example.fintrack.bill.BillRepository;
import com.example.fintrack.category.dto.AddCategoryDto;
import com.example.fintrack.category.dto.UpdateCategoryDto;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class CategoryServiceTest {

    @Mock private CategoryRepository categoryRepository;
    @Mock private UserProvider userProvider;
    @Mock private BillRepository billRepository;

    @InjectMocks private CategoryService categoryService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
        when(userProvider.getLoggedUser()).thenReturn(user);
    }

    @Test
    void shouldAddCategory() {
        AddCategoryDto dto = new AddCategoryDto("Test", "#fff");

        when(categoryRepository.existsCategoryByNameIgnoringCaseAndUserId(eq("Test"), eq(1L))).thenReturn(false);

        categoryService.addCategory(dto);

        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    void shouldThrowWhenAddingDuplicateCategory() {
        AddCategoryDto dto = new AddCategoryDto("Test", "#fff");

        when(categoryRepository.existsCategoryByNameIgnoringCaseAndUserId(eq("Test"), eq(1L))).thenReturn(true);

        assertThrows(RuntimeException.class, () -> categoryService.addCategory(dto));
    }

    @Test
    void shouldUpdateCategory() {
        UpdateCategoryDto dto = new UpdateCategoryDto("Updated", "#000");
        Category category = new Category();

        when(categoryRepository.findCategoryByIdAndUserId(eq(1L), eq(1L))).thenReturn(Optional.of(category));

        categoryService.updateCategory(1L, dto);

        verify(categoryRepository).save(category);
        assertThat(category.getName()).isEqualTo("Updated");
        assertThat(category.getColor()).isEqualTo("#000");
    }

    @Test
    void shouldDeleteCategoryAndReassignBills() {
        Category category = new Category();
        category.setIsDefault(false);
        List<Category> defaultCategories = List.of(new Category(), new Category());
        List<Bill> bills = List.of(new Bill());

        when(categoryRepository.findCategoryByIdAndUserId(1L, 1L)).thenReturn(Optional.of(category));
        when(categoryRepository.findCategoryByUserIdAndIsDefault(1L, true)).thenReturn(defaultCategories);
        when(billRepository.findBillsByUserIdAndCategoryId(1L, 1L)).thenReturn(bills);

        categoryService.deleteCategory(1L);

        verify(billRepository).saveAll(bills);
        verify(categoryRepository).delete(category);
    }

    @Test
    void shouldThrowWhenDeletingDefaultCategory() {
        Category category = new Category();
        category.setIsDefault(true);

        when(categoryRepository.findCategoryByIdAndUserId(1L, 1L)).thenReturn(Optional.of(category));

        assertThrows(RuntimeException.class, () -> categoryService.deleteCategory(1L));
    }
}
