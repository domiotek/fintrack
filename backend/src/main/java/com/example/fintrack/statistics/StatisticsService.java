package com.example.fintrack.statistics;

import com.example.fintrack.bill.Bill;
import com.example.fintrack.bill.BillRepository;
import com.example.fintrack.category.Category;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.statistics.dto.StatisticsChartDataDto;
import com.example.fintrack.statistics.dto.StatisticsDashboardDto;
import com.example.fintrack.statistics.enums.Group;
import com.example.fintrack.statistics.enums.Operation;
import com.example.fintrack.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.*;

import static com.example.fintrack.bill.BillSpecification.*;
import static com.example.fintrack.bill.BillSpecification.hasCategoryId;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final UserProvider userProvider;
    private final BillRepository billRepository;

    public StatisticsDashboardDto getDashboardStatistics(ZonedDateTime from, ZonedDateTime to, Long categoryId) {
        User user = userProvider.getLoggedUser();

        Specification<Bill> billSpecification = hasUserId(user.getId()).or(hasPaidById(user.getId()))
                .and(hasBillsBetweenDates(from, to));
        if(categoryId != null) {
            billSpecification = billSpecification.and(hasCategoryId(categoryId));
        }

        List<Bill> bills = billRepository.findAll(billSpecification);

        BigDecimal totalSum = bills.stream().map(Bill::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        Specification<Bill> billSpecificationPreviousMonth = hasUserId(user.getId()).or(hasPaidById(user.getId()))
                .and(hasBillsBetweenDates(from.minusMonths(1L), to.minusMonths(1L)));
        if(categoryId != null) {
            billSpecificationPreviousMonth = billSpecificationPreviousMonth.and(hasCategoryId(categoryId));
        }

        List<Bill> billsPreviousMonth = billRepository.findAll(billSpecificationPreviousMonth);

        BigDecimal totalSumPreviousMonth = billsPreviousMonth.stream().map(Bill::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        NavigableMap<LocalDate, BigDecimal> spendingPerDay = new TreeMap<>();

        bills.forEach(bill -> spendingPerDay.merge(bill.getDate().toLocalDate(), bill.getAmount(), BigDecimal::add));

        NavigableMap<LocalDate, BigDecimal> statistics = new TreeMap<>();

        spendingPerDay.entrySet().forEach(entry -> {
            if (entry.equals(spendingPerDay.firstEntry())) {
                statistics.put(entry.getKey(), entry.getValue());
            } else {
                statistics.put(entry.getKey(), entry.getValue().add(statistics.lastEntry().getValue()));
            }
        });

        List<LocalDate> labels = new ArrayList<>(statistics.keySet());
        List<BigDecimal> data = new ArrayList<>(statistics.values());

        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        List<String> formattedLabels = labels.stream().map(dateTimeFormatter::format).toList();

        return StatisticsDashboardDto.builder()
                .totalSpending(totalSum)
                .previousMonthDifference(totalSumPreviousMonth.subtract(totalSum))
                .chartData(StatisticsChartDataDto.builder()
                        .labels(formattedLabels)
                        .data(data)
                        .build()
                )
                .build();
    }

    public StatisticsChartDataDto getExpensesStatistics(ZonedDateTime from, ZonedDateTime to, Long categoryId, Group group) {
        User user = userProvider.getLoggedUser();

        Specification<Bill> billSpecification = hasUserId(user.getId()).or(hasPaidById(user.getId()))
                .and(hasBillsBetweenDates(from, to));
        if(categoryId != null) {
            billSpecification = billSpecification.and(hasCategoryId(categoryId));
        }

        List<Bill> bills = billRepository.findAll(billSpecification);

        List<String> formattedLabels;
        List<BigDecimal> data;

        if (group == Group.DAY) {
            Map<LocalDate, BigDecimal> spending = new TreeMap<>();
            bills.forEach(bill -> spending.merge(bill.getDate().toLocalDate(), bill.getAmount(), BigDecimal::add));

            List<LocalDate> labels = new ArrayList<>(spending.keySet());
            data = new ArrayList<>(spending.values());

            DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            formattedLabels = labels.stream().map(dateTimeFormatter::format).toList();
        } else if (group == Group.MONTH) {
            Map<YearMonth, BigDecimal> spending = new TreeMap<>();
            for (YearMonth yearMonth = YearMonth.from(from); !yearMonth.isAfter(YearMonth.from(to)); yearMonth = yearMonth.plusMonths(1)) {
                spending.put(yearMonth, BigDecimal.ZERO);
            }

            bills.forEach(bill -> spending.merge(YearMonth.from(bill.getDate().toLocalDate()), bill.getAmount(), BigDecimal::add));

            List<YearMonth> labels = new ArrayList<>(spending.keySet());
            data = new ArrayList<>(spending.values());

            DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM");
            formattedLabels = labels.stream().map(dateTimeFormatter::format).toList();
        } else {
            Map<Integer, BigDecimal> spending = new TreeMap<>();
            for (int i = from.getYear(); i <= to.getYear(); i++) {
                spending.put(i, BigDecimal.ZERO);
            }

            bills.forEach(bill -> spending.merge(bill.getDate().toLocalDate().getYear(), bill.getAmount(), BigDecimal::add));

            List<Integer> labels = new ArrayList<>(spending.keySet());
            data = new ArrayList<>(spending.values());

            formattedLabels = labels.stream().map(Object::toString).toList();
        }

        return StatisticsChartDataDto.builder()
                .labels(formattedLabels)
                .data(data)
                .build();
    }

    public StatisticsChartDataDto getTransactionsStatistics(ZonedDateTime from, ZonedDateTime to, Long categoryId, Group group) {
        User user = userProvider.getLoggedUser();

        Specification<Bill> billSpecification = hasUserId(user.getId()).or(hasPaidById(user.getId()))
                .and(hasBillsBetweenDates(from, to));
        if(categoryId != null) {
            billSpecification = billSpecification.and(hasCategoryId(categoryId));
        }

        List<Bill> bills = billRepository.findAll(billSpecification);

        List<String> formattedLabels;
        List<BigDecimal> data;

        if (group == Group.DAY) {
            Map<LocalDate, Integer> spending = new TreeMap<>();
            bills.forEach(bill -> spending.merge(bill.getDate().toLocalDate(), 1, Integer::sum));

            List<LocalDate> labels = new ArrayList<>(spending.keySet());
            data = new ArrayList<>(spending.values()).stream()
                    .map(BigDecimal::valueOf)
                    .toList();

            DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            formattedLabels = labels.stream().map(dateTimeFormatter::format).toList();
        } else if (group == Group.MONTH) {
            Map<YearMonth, Integer> spending = new TreeMap<>();
            for (YearMonth yearMonth = YearMonth.from(from); !yearMonth.isAfter(YearMonth.from(to)); yearMonth = yearMonth.plusMonths(1)) {
                spending.put(yearMonth, 0);
            }

            bills.forEach(bill -> spending.merge(YearMonth.from(bill.getDate().toLocalDate()), 1, Integer::sum));

            List<YearMonth> labels = new ArrayList<>(spending.keySet());
            data = new ArrayList<>(spending.values()).stream()
                    .map(BigDecimal::valueOf)
                    .toList();

            DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM");
            formattedLabels = labels.stream().map(dateTimeFormatter::format).toList();
        } else {
            Map<Integer, Integer> spending = new TreeMap<>();
            for (int i = from.getYear(); i <= to.getYear(); i++) {
                spending.put(i, 0);
            }

            bills.forEach(bill -> spending.merge(bill.getDate().toLocalDate().getYear(), 1, Integer::sum));

            List<Integer> labels = new ArrayList<>(spending.keySet());
            data = new ArrayList<>(spending.values()).stream()
                    .map(BigDecimal::valueOf)
                    .toList();

            formattedLabels = labels.stream().map(Object::toString).toList();
        }

        return StatisticsChartDataDto.builder()
                .labels(formattedLabels)
                .data(data)
                .build();
    }

    public StatisticsChartDataDto getCategoryStatistics(ZonedDateTime from, ZonedDateTime to) {
        User user = userProvider.getLoggedUser();

        Specification<Bill> billSpecification = hasUserId(user.getId()).or(hasPaidById(user.getId()))
                .and(hasBillsBetweenDates(from, to));

        List<Bill> bills = billRepository.findAll(billSpecification);

        Map<Category, BigDecimal> spendingPerCategory = new TreeMap<>(Comparator.comparing(Category::getName));

        bills.forEach(bill -> spendingPerCategory.merge(bill.getCategory(), bill.getAmount(), BigDecimal::add));

        List<Category> labels = new ArrayList<>(spendingPerCategory.keySet());
        List<BigDecimal> data = new ArrayList<>(spendingPerCategory.values());

        List<String> formattedLabels = labels.stream().map(Category::getName).toList();

        return StatisticsChartDataDto.builder()
                .labels(formattedLabels)
                .data(data)
                .build();
    }

    public StatisticsChartDataDto getDayOfWeekStatistics(ZonedDateTime from, ZonedDateTime to, Operation operation, Long categoryId) {
        User user = userProvider.getLoggedUser();

        Specification<Bill> billSpecification = hasUserId(user.getId()).or(hasPaidById(user.getId()))
                .and(hasBillsBetweenDates(from, to));
        if(categoryId != null) {
            billSpecification = billSpecification.and(hasCategoryId(categoryId));
        }

        List<Bill> bills = billRepository.findAll(billSpecification);

        Map<DayOfWeek, BigDecimal> spendingPerCategory = new TreeMap<>();

        List.of(DayOfWeek.values()).forEach(dayOfWeek -> spendingPerCategory.put(dayOfWeek, BigDecimal.ZERO));

        if (operation == Operation.SUM) {
            bills.forEach(bill -> spendingPerCategory.merge(bill.getDate().getDayOfWeek(), bill.getAmount(), BigDecimal::add));
        } else {
            Map<DayOfWeek, List<BigDecimal>> spendingPerCategoryList = new HashMap<>();

            List.of(DayOfWeek.values()).forEach(dayOfWeek -> spendingPerCategoryList.put(dayOfWeek, new ArrayList<>()));

            bills.forEach(bill -> spendingPerCategoryList.get(bill.getDate().getDayOfWeek()).add(bill.getAmount()));

            spendingPerCategoryList.forEach((key, value) -> {
                if (value.isEmpty()) {
                    spendingPerCategory.put(key, BigDecimal.ZERO);
                } else {
                    BigDecimal sum = value.stream().reduce(BigDecimal.ZERO, BigDecimal::add);

                    spendingPerCategory.put(key, sum.divide(BigDecimal.valueOf(value.size()), RoundingMode.HALF_UP));
                }
            });
        }

        List<DayOfWeek> labels = new ArrayList<>(spendingPerCategory.keySet());
        List<BigDecimal> data = new ArrayList<>(spendingPerCategory.values());

        List<String> formattedLabels = labels.stream()
                .map(dayOfWeek -> dayOfWeek.getDisplayName(TextStyle.FULL, Locale.of("pl", "PL")))
                .toList();

        return StatisticsChartDataDto.builder()
                .labels(formattedLabels)
                .data(data)
                .build();
    }
}
