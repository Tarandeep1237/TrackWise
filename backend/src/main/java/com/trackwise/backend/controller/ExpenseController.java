package com.trackwise.backend.controller;

import com.trackwise.backend.entity.Expense;
import com.trackwise.backend.repository.ExpenseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseRepository expenseRepository;

    public ExpenseController(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    private Long getUserId() {
        return Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
    }

    @PostMapping
    public ResponseEntity<?> addExpense(@RequestBody Expense request) {
        Long userId = getUserId();
        
        Expense expense = new Expense();
        expense.setUserId(userId);
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate() != null ? request.getDate() : LocalDate.now());
        expense.setDescription(request.getDescription());
        
        Expense savedExpense = expenseRepository.save(expense);
        return ResponseEntity.ok(savedExpense);
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getExpenses() {
        Long userId = getUserId();
        List<Expense> expenses = expenseRepository.findByUserIdOrderByDateDesc(userId);
        return ResponseEntity.ok(expenses);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        Long userId = getUserId();
        Optional<Expense> expense = expenseRepository.findById(id);
        
        if (expense.isPresent() && expense.get().getUserId().equals(userId)) {
            expenseRepository.deleteById(id);
            return ResponseEntity.ok("Expense deleted");
        }
        
        return ResponseEntity.status(403).body("Not authorized or not found");
    }
}
