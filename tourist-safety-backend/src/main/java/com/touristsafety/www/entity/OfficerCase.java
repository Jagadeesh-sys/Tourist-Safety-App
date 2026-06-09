package com.touristsafety.www.entity;

import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "officer_cases")
@Data
public class OfficerCase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String caseId;

    private String tourist;

    private String priority = "critical";

    private String status = "new";
}
