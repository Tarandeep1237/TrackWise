package com.trackwise.backend.repository;

import com.trackwise.backend.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByUserIdOrderByDateDesc(Long userId);
    List<Income> findByUserId(Long userId);
}
