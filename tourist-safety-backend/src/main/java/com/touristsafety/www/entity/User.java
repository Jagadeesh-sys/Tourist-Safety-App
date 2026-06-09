package com.touristsafety.www.entity;

import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    private String role = "USER";
    private String status = "active";

    // Profile Fields
    private String phone;

    private String emergencyContactName;

    private String emergencyContactPhone;

    private String nationality;

    private String preferredLanguage;
}
