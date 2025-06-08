package com.example.fintrack.statistics;

import com.example.fintrack.statistics.dto.StatisticsChartDataDto;
import com.example.fintrack.statistics.dto.StatisticsDashboardDto;
import com.example.fintrack.statistics.enums.Group;
import com.example.fintrack.statistics.enums.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZonedDateTime;

@RestController
@RequestMapping("/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<StatisticsDashboardDto> getDashboardStatistics(
            @RequestParam ZonedDateTime from,
            @RequestParam ZonedDateTime to,
            @RequestParam(required = false) Long categoryId
    ) {
        return ResponseEntity.ok().body(statisticsService.getDashboardStatistics(from, to, categoryId));
    }

    @GetMapping("/expenses")
    public ResponseEntity<StatisticsChartDataDto> getDashboardStatistics(
            @RequestParam ZonedDateTime from,
            @RequestParam ZonedDateTime to,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "DAY") Group group
    ) {
        return ResponseEntity.ok().body(statisticsService.getExpensesStatistics(from, to, categoryId, group));
    }

    @GetMapping("/transactions")
    public ResponseEntity<StatisticsChartDataDto> getTransactionsStatistics(
            @RequestParam ZonedDateTime from,
            @RequestParam ZonedDateTime to,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "DAY") Group group
    ) {
        return ResponseEntity.ok().body(statisticsService.getTransactionsStatistics(from, to, categoryId, group));
    }

    @GetMapping("/categories")
    public ResponseEntity<StatisticsChartDataDto> getCategoryStatistics(
            @RequestParam ZonedDateTime from,
            @RequestParam ZonedDateTime to
    ) {
        return ResponseEntity.ok().body(statisticsService.getCategoryStatistics(from, to));
    }

    @GetMapping("/day-of-week")
    public ResponseEntity<StatisticsChartDataDto> getDayOfWeekStatistics(
            @RequestParam ZonedDateTime from,
            @RequestParam ZonedDateTime to,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "SUM") Operation operation
    ) {
        return ResponseEntity.ok().body(statisticsService.getDayOfWeekStatistics(from, to, operation, categoryId));
    }
}
