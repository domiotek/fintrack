package com.example.fintrack.category;

import com.example.fintrack.bill.Bill;
import com.example.fintrack.bill.BillRepository;
import com.example.fintrack.category.dto.AddCategoryDto;
import com.example.fintrack.category.dto.CategoryDto;
import com.example.fintrack.category.dto.UpdateCategoryDto;
import com.example.fintrack.currency.CurrencyConverter;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.User;
import com.example.fintrack.utils.enums.SortDirection;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;

import static com.example.fintrack.category.CategorySpecification.*;
import static com.example.fintrack.exception.BusinessErrorCodes.CANNOT_DELETE_DEFAULT_CATEGORY;
import static com.example.fintrack.exception.BusinessErrorCodes.CATEGORY_DOES_NOT_EXIST;


@Service
@AllArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CurrencyConverter currencyConverter;
    private final UserProvider userProvider;
    private final BillRepository billRepository;

    public Page<CategoryDto> getCategories(
            String name, ZonedDateTime from, ZonedDateTime to, SortDirection sortOrder, int page, int size
    ) {
        User user = userProvider.getLoggedUser();

        Specification<Category> categorySpecification = hasUserId(user.getId());
        if(name != null) {
            categorySpecification = categorySpecification.and(hasCategoryName(name));
        }

        Sort.Direction sortDirection = sortOrder.toSortDirection();
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDirection, "name"));
        Page<Category> categories = categoryRepository.findAll(categorySpecification, pageRequest);

        return categories.map(category -> CategoryMapper.categoryToCategoryDto(category, from, to, currencyConverter));
    }

    public void addCategory(AddCategoryDto addCategoryDto) {
        User user = userProvider.getLoggedUser();

        Category category = CategoryMapper.addCategoryDtoToCategory(addCategoryDto, user);

        categoryRepository.save(category);
    }

    public void updateCategory(long categoryId, UpdateCategoryDto updateCategoryDto) {
        User user = userProvider.getLoggedUser();

        Category category = categoryRepository.findCategoryByIdAndUserId(categoryId, user.getId())
                .orElseThrow(CATEGORY_DOES_NOT_EXIST::getError);

        if (updateCategoryDto.name() != null) {
            category.setName(updateCategoryDto.name());
        }
        if (updateCategoryDto.color() != null) {
            category.setColor(updateCategoryDto.color());
        }

        categoryRepository.save(category);
    }

    public void deleteCategory(long categoryId) {
        User user = userProvider.getLoggedUser();

        Category category = categoryRepository.findCategoryByIdAndUserId(categoryId, user.getId())
                .orElseThrow(CATEGORY_DOES_NOT_EXIST::getError);

        if (category.getIsDefault()) {
            throw CANNOT_DELETE_DEFAULT_CATEGORY.getError();
        }

        List<Category> categories = categoryRepository.findCategoryByUserIdAndIsDefault(user.getId(), true);

        if (categories.size() != 2) {
            throw CATEGORY_DOES_NOT_EXIST.getError();
        }

        Category defaultCategory = categories.getFirst();

        List<Bill> bills = billRepository.findBillsByUserIdAndCategoryId(user.getId(), categoryId);

        bills.forEach(bill -> bill.setCategory(defaultCategory));

        billRepository.saveAll(bills);

        categoryRepository.delete(category);
    }
}
