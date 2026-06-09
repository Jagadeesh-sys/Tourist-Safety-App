package com.touristsafety.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.touristsafety.www.entity.OfficerCase;

public interface OfficerCaseRepository extends JpaRepository<OfficerCase, Long> {
}
