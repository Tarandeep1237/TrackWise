package com.trackwise.backend.controller;

import com.trackwise.backend.dto.AnalyticsResponse;
import com.trackwise.backend.entity.Expense;
import com.trackwise.backend.entity.Income;
import com.trackwise.backend.repository.ExpenseRepository;
import com.trackwise.backend.repository.IncomeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;

    public AnalyticsController(ExpenseRepository expenseRepository, IncomeRepository incomeRepository) {
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
    }

    private Long getUserId() {
        return Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
    }

    @GetMapping
    public ResponseEntity<AnalyticsResponse> getAnalytics() {
        Long userId = getUserId();
        
        List<Income> incomes = incomeRepository.findByUserId(userId);
        List<Expense> expenses = expenseRepository.findByUserId(userId);
        
        BigDecimal totalIncome = incomes.stream().map(Income::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalExpense = expenses.stream().map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal balance = totalIncome.subtract(totalExpense);
        
        // Category Breakdown
        Map<String, BigDecimal> categoryMap = new HashMap<>();
        for (Expense e : expenses) {
            categoryMap.put(e.getCategory(), categoryMap.getOrDefault(e.getCategory(), BigDecimal.ZERO).add(e.getAmount()));
        }
        List<AnalyticsResponse.CategoryBreakdown> categoryBreakdown = categoryMap.entrySet().stream()
                .map(entry -> new AnalyticsResponse.CategoryBreakdown(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
                
        // Monthly Expenses (last 6 months trend roughly, doing in memory grouping by YYYY-MM)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        Map<String, BigDecimal> monthlyMap = expenses.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getDate().format(formatter),
                        Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)
                ));
                
        List<AnalyticsResponse.MonthlyExpense> monthlyExpenses = monthlyMap.entrySet().stream()
                .sorted(Map.Entry.<String, BigDecimal>comparingByKey())
                .map(entry -> new AnalyticsResponse.MonthlyExpense(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
                
        // Keeping only last 6
        if (monthlyExpenses.size() > 6) {
            monthlyExpenses = monthlyExpenses.subList(monthlyExpenses.size() - 6, monthlyExpenses.size());
        }

        AnalyticsResponse response = new AnalyticsResponse();
        response.setTotalIncome(totalIncome);
        response.setTotalExpense(totalExpense);
        response.setBalance(balance);
        response.setCategoryBreakdown(categoryBreakdown);
        response.setMonthlyExpenses(monthlyExpenses);
        
        return ResponseEntity.ok(response);
    }
}
