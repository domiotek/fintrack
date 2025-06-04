package com.example.fintrack.limit;

import com.example.fintrack.category.Category;
import com.example.fintrack.category.CategoryRepository;
import com.example.fintrack.category.CategorySpecification;
import com.example.fintrack.currency.CurrencyConverter;
import com.example.fintrack.limit.dto.AddLimitDto;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.User;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;


import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.List;

import static com.example.fintrack.exception.BusinessErrorCodes.CATEGORY_DOES_NOT_EXIST;
import static com.example.fintrack.exception.BusinessErrorCodes.LIMIT_DOES_NOT_EXIST;

@Service
@AllArgsConstructor
public class LimitService {

    private final LimitRepository limitRepository;
    private final UserProvider userProvider;
    private final CurrencyConverter currencyConverter;
    private final CategoryRepository categoryRepository;

    public void addLimit(long categoryId, AddLimitDto addLimitDto) {
        User user = userProvider.getLoggedUser();

        Specification<Category> categorySpecification = CategorySpecification.hasUserId(user.getId());

        List<Category> categories = categoryRepository.findAll(categorySpecification);

        var category = categories.stream()
                .filter(c -> c.getId() == categoryId)
                .findFirst()
                .orElseThrow(CATEGORY_DOES_NOT_EXIST::getError);

        if(!category.getLimits().isEmpty()) {
            var lastLimit = category.getLimits().stream()
                    .max(Comparator.comparing(Limit::getId))
                    .orElseThrow(LIMIT_DOES_NOT_EXIST::getError);

            lastLimit.setEndDateTime(addLimitDto.startDateTime());
            limitRepository.save(lastLimit);
        }

        Limit limit = LimitMapper.addLimitDtoToLimit(addLimitDto, category, currencyConverter);

        limitRepository.save(limit);
    }

    public void deleteLimit(long categoryId, long limitId) {
        User user = userProvider.getLoggedUser();

        Category category = user.getCategories().stream()
                .filter(c -> c.getId() == categoryId)
                .findFirst()
                .orElseThrow(CATEGORY_DOES_NOT_EXIST::getError);

        Limit limit = category.getLimits().stream()
                .filter(l -> l.getId() == limitId)
                .findFirst()
                .orElseThrow(LIMIT_DOES_NOT_EXIST::getError);

        limitRepository.delete(limit);
    }
}
