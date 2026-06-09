package com.touristsafety.www.entity;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Entity
@Table(name = "sos")
@Data
public class SOS {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tourist;

    private String userEmail;

    private String location;

    @Column(length = 1000)
    private String message;

    private Double lat;

    private Double lng;

    private String status = "active";

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private java.time.LocalDateTime time;
}
