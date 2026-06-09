package com.touristsafety.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.touristsafety.www.entity.SOS;
import java.util.List;

public interface SOSRepository extends JpaRepository<SOS, Long> {
    List<SOS> findByUserEmail(String userEmail);
    List<SOS> findByStatus(String status);
}
