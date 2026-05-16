package com.trackwise.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class AnalyticsResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;
    private List<CategoryBreakdown> categoryBreakdown;
    private List<MonthlyExpense> monthlyExpenses;

    @Data
    public static class CategoryBreakdown {
        private String category;
        private BigDecimal total;
        
        public CategoryBreakdown(String category, BigDecimal total) {
            this.category = category;
            this.total = total;
        }
    }

    @Data
    public static class MonthlyExpense {
        private String month;
        private BigDecimal total;
        
        public MonthlyExpense(String month, BigDecimal total) {
            this.month = month;
            this.total = total;
        }
    }
}
