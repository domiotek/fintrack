package com.example.fintrack.statistics;

import com.example.fintrack.bill.Bill;
import com.example.fintrack.bill.BillRepository;
import com.example.fintrack.category.Category;
import com.example.fintrack.currency.Currency;
import com.example.fintrack.currency.CurrencyConverter;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.statistics.dto.StatisticsChartDataDto;
import com.example.fintrack.statistics.dto.StatisticsDashboardDto;
import com.example.fintrack.statistics.enums.Group;
import com.example.fintrack.statistics.enums.Operation;
import com.example.fintrack.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.when;

class StatisticsServiceTest {

    @Mock private UserProvider userProvider;
    @Mock private BillRepository billRepository;
    @Mock private CurrencyConverter currencyConverter;

    @InjectMocks private StatisticsService statisticsService;

    private User user;
    private Bill bill;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        Currency currency = new Currency();
        currency.setId(1L);
        currency.setCode("PLN");
        user = new User();
        user.setId(1L);
        user.setCurrency(currency);

        bill = new Bill();
        bill.setAmount(BigDecimal.valueOf(100));
        bill.setDate(ZonedDateTime.now());

        when(userProvider.getLoggedUser()).thenReturn(user);
        when(currencyConverter.convertFromUSDToGivenCurrency(any(), any(LocalDate.class), any()))
                .thenAnswer(inv -> inv.getArgument(2));
    }

    @Test
    void shouldReturnDashboardStats() {
        ZonedDateTime from = ZonedDateTime.now().minusDays(10);
        ZonedDateTime to = ZonedDateTime.now();

        when(billRepository.findAll(any(Specification.class)))
                .thenReturn(List.of(bill))
                .thenReturn(List.of());

        StatisticsDashboardDto result = statisticsService.getDashboardStatistics(from, to, null);

        assertNotNull(result);
        assertEquals(BigDecimal.valueOf(100).setScale(2), result.totalSpending());
        assertEquals(BigDecimal.valueOf(100).setScale(2), result.previousMonthDifference());
        assertEquals(1, result.chartData().data().size());
    }

    @Test
    void shouldReturnExpensesStatsGroupedByDay() {
        ZonedDateTime from = ZonedDateTime.now().minusDays(3);
        ZonedDateTime to = ZonedDateTime.now();

        when(billRepository.findAll(any(Specification.class))).thenReturn(List.of(bill));

        StatisticsChartDataDto result = statisticsService.getExpensesStatistics(from, to, null, Group.DAY);

        assertNotNull(result);
        assertEquals(1, result.data().size());
        assertEquals(BigDecimal.valueOf(100).setScale(2), result.data().get(0));
    }

    @Test
    void shouldReturnTransactionsStatsGroupedByMonth() {
        ZonedDateTime from = ZonedDateTime.now().minusMonths(1);
        ZonedDateTime to = ZonedDateTime.now();

        when(billRepository.findAll(any(Specification.class))).thenReturn(List.of(bill));

        StatisticsChartDataDto result = statisticsService.getTransactionsStatistics(from, to, null, Group.MONTH);

        assertNotNull(result);
        assertEquals(2, result.data().size());
        assertTrue(result.data().stream().anyMatch(v -> v.compareTo(BigDecimal.ONE) == 0));
    }

    @Test
    void shouldReturnCategoryStatistics() {
        Category category = new Category();
        category.setName("Food");
        bill.setCategory(category);

        when(billRepository.findAll(any(Specification.class))).thenReturn(List.of(bill));

        StatisticsChartDataDto result = statisticsService.getCategoryStatistics(
                ZonedDateTime.now().minusDays(10),
                ZonedDateTime.now()
        );

        assertNotNull(result);
        assertEquals(List.of("Food"), result.labels());
        assertEquals(List.of(BigDecimal.valueOf(100).setScale(2)), result.data());
    }

    @Test
    void shouldReturnDayOfWeekStatsWithSum() {
        bill.setDate(ZonedDateTime.of(LocalDateTime.of(2025, 6, 12, 10, 0), ZoneId.systemDefault()));

        when(billRepository.findAll(any(Specification.class))).thenReturn(List.of(bill));

        StatisticsChartDataDto result = statisticsService.getDayOfWeekStatistics(
                ZonedDateTime.now().minusDays(10),
                ZonedDateTime.now(),
                Operation.SUM,
                null
        );

        assertNotNull(result);
        assertTrue(result.labels().contains("czwartek"));
    }
}
