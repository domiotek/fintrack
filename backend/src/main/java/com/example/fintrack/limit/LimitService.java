package com.example.fintrack.limit;

import com.example.fintrack.category.Category;
import com.example.fintrack.category.CategoryRepository;
import com.example.fintrack.currency.CurrencyConverter;
import com.example.fintrack.limit.dto.AddLimitDto;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;

import static com.example.fintrack.exception.BusinessErrorCodes.CATEGORY_DOES_NOT_EXIST;
import static com.example.fintrack.exception.BusinessErrorCodes.LIMIT_DOES_NOT_EXIST;
import static java.util.Comparator.comparing;

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

        ZonedDateTime now = ZonedDateTime.now();

        if(!category.getLimits().isEmpty()) {
            Limit lastLimit = category.getLimits().stream()
                    .max(comparing(Limit::getId))
                    .orElseThrow(LIMIT_DOES_NOT_EXIST::getError);

            lastLimit.setEndDateTime(now);
            limitRepository.save(lastLimit);
        }

        Limit limit = LimitMapper.addLimitDtoToLimit(addLimitDto, category, currencyConverter, now);

        limitRepository.save(limit);
    }
}
