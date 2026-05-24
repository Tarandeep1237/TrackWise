package com.trackwise.backend.controller;

import com.trackwise.backend.entity.Income;
import com.trackwise.backend.repository.IncomeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/income")
public class IncomeController {

    private final IncomeRepository incomeRepository;

    public IncomeController(IncomeRepository incomeRepository) {
        this.incomeRepository = incomeRepository;
    }

    private Long getUserId() {
        return Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
    }

    @PostMapping
    public ResponseEntity<?> addIncome(@RequestBody Income request) {
        Long userId = getUserId();
        
        Income income = new Income();
        income.setUserId(userId);
        income.setAmount(request.getAmount());
        income.setSource(request.getSource());
        income.setDate(request.getDate() != null ? request.getDate() : LocalDate.now());
        
        Income savedIncome = incomeRepository.save(income);
        return ResponseEntity.ok(savedIncome);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateIncome(@PathVariable Long id, @RequestBody Income request) {
        Long userId = getUserId();
        Optional<Income> optionalIncome = incomeRepository.findById(id);
        
        if (optionalIncome.isPresent() && optionalIncome.get().getUserId().equals(userId)) {
            Income income = optionalIncome.get();
            income.setAmount(request.getAmount());
            income.setSource(request.getSource());
            income.setDate(request.getDate() != null ? request.getDate() : LocalDate.now());
            
            Income updatedIncome = incomeRepository.save(income);
            return ResponseEntity.ok(updatedIncome);
        }
        
        return ResponseEntity.status(403).body("Not authorized or not found");
    }

    @GetMapping
    public ResponseEntity<List<Income>> getIncome() {
        Long userId = getUserId();
        List<Income> incomeList = incomeRepository.findByUserIdOrderByDateDesc(userId);
        return ResponseEntity.ok(incomeList);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIncome(@PathVariable Long id) {
        Long userId = getUserId();
        Optional<Income> income = incomeRepository.findById(id);
        
        if (income.isPresent() && income.get().getUserId().equals(userId)) {
            incomeRepository.deleteById(id);
            return ResponseEntity.ok("Income deleted");
        }
        
        return ResponseEntity.status(403).body("Not authorized or not found");
    }
}
