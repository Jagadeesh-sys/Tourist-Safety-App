package com.touristsafety.www.entity;

import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "trips")
@Data
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String destination;

    private String startDate;

    private String endDate;

    @Column(length = 2000)
    private String notes;

    private String status = "PLANNED";
    
    private String userEmail;
    
    private Integer safetyScore = 85;
    
    private Double lat;
    
    private Double lng;
}
