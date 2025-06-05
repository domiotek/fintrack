package com.example.fintrack.limit;

import com.example.fintrack.category.Category;
import com.example.fintrack.category.CategoryRepository;
import com.example.fintrack.currency.CurrencyConverter;
import com.example.fintrack.limit.dto.AddLimitDto;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

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

        Category category = categoryRepository.findCategoryByIdAndUserId(categoryId, user.getId())
                .orElseThrow(CATEGORY_DOES_NOT_EXIST::getError);

        Limit limit = LimitMapper.addLimitDtoToLimit(addLimitDto, category, currencyConverter);

        limitRepository.save(limit);
    }

    public void deleteLimit(long categoryId, long limitId) {
        User user = userProvider.getLoggedUser();

        Limit limit = limitRepository.findLimitByIdAndCategoryIdAndCategoryUserId(limitId, categoryId, user.getId())
                .orElseThrow(LIMIT_DOES_NOT_EXIST::getError);

        limitRepository.delete(limit);
    }
}
