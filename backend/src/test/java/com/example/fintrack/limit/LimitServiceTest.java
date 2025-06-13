package com.example.fintrack.limit;

import com.example.fintrack.category.Category;
import com.example.fintrack.category.CategoryRepository;
import com.example.fintrack.currency.Currency;
import com.example.fintrack.currency.CurrencyConverter;
import com.example.fintrack.limit.dto.AddLimitDto;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Optional;

import static org.mockito.Mockito.*;

class LimitServiceTest {

    @Mock private LimitRepository limitRepository;
    @Mock private UserProvider userProvider;
    @Mock private CategoryRepository categoryRepository;
    @Mock private CurrencyConverter currencyConverter;

    @InjectMocks private LimitService limitService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
        when(userProvider.getLoggedUser()).thenReturn(user);
        when(currencyConverter.convertFromGivenCurrencyToUSD(any(), any()))
                .thenAnswer(invocation -> invocation.getArgument(1));
    }

    @Test
    void shouldAddFirstLimitToCategory() {
        Category category = new Category();
        category.setLimits(new HashSet<>());

        User categoryOwner = new User();
        categoryOwner.setCurrency(new Currency());
        category.setUser(categoryOwner);

        when(categoryRepository.findCategoryByIdAndUserId(1L, 1L)).thenReturn(Optional.of(category));

        AddLimitDto dto = new AddLimitDto(BigDecimal.TEN);

        limitService.addLimit(1L, dto);

        verify(limitRepository).save(any(Limit.class));
    }


    @Test
    void shouldClosePreviousLimitAndAddNew() {
        Category category = new Category();
        Limit oldLimit = new Limit();
        oldLimit.setId(1L);
        category.setLimits(new java.util.HashSet<>(java.util.List.of(oldLimit)));

        User categoryOwner = new User();
        categoryOwner.setCurrency(new Currency());
        category.setUser(categoryOwner);

        when(categoryRepository.findCategoryByIdAndUserId(1L, 1L)).thenReturn(Optional.of(category));

        AddLimitDto dto = new AddLimitDto(BigDecimal.valueOf(20));

        limitService.addLimit(1L, dto);

        verify(limitRepository, times(2)).save(any());
        verify(limitRepository).save(oldLimit);
    }

    @Test
    void shouldThrowWhenCategoryNotFound() {
        when(categoryRepository.findCategoryByIdAndUserId(1L, 1L)).thenReturn(Optional.empty());

        try {
            limitService.addLimit(1L, new AddLimitDto(BigDecimal.TEN));
        } catch (RuntimeException ignored) {}

        verify(limitRepository, never()).save(any());
    }
}
