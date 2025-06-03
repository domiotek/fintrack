package com.example.fintrack.category.limit;

import com.example.fintrack.category.CategoryRepository;
import com.example.fintrack.category.dto.AddLimitDto;
import com.example.fintrack.exception.BusinessErrorCodes;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;


import static com.example.fintrack.exception.BusinessErrorCodes.CATEGORY_DOES_NOT_EXIST;
import static com.example.fintrack.exception.BusinessErrorCodes.LIMIT_DOES_NOT_EXIST;

@Service
@AllArgsConstructor
public class LimitService {

    private final LimitRepository limitRepository;
    private final CategoryRepository categoryRepository;

    public void addLimit(AddLimitDto addLimitDto) {
        var category = categoryRepository.findById(addLimitDto.categoryId())
                .orElseThrow(CATEGORY_DOES_NOT_EXIST::getError);

        var limit = LimitMapper.addLimitDtoToLimit(addLimitDto, category);
        limitRepository.save(limit);
    }

    public void deleteLimit(Long id) {
        var limit = limitRepository.findById(id).orElseThrow(LIMIT_DOES_NOT_EXIST::getError);

        limitRepository.delete(limit);
    }
}
