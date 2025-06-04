package com.example.fintrack.limit;

import com.example.fintrack.category.Category;
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

    public void addLimit(long categoryId, AddLimitDto addLimitDto) {
        User user = userProvider.getLoggedUser();

        Category category = user.getCategories().stream()
                .filter(c -> c.getId() == categoryId)
                .findFirst()
                .orElseThrow(CATEGORY_DOES_NOT_EXIST::getError);

        Limit limit = LimitMapper.addLimitDtoToLimit(addLimitDto, category);

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
