package com.touristsafety.www.entity;

import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "community_posts")
@Data
public class CommunityPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2000)
    private String text;

    @Column(nullable = false)
    private String userEmail;

    @Column(nullable = false)
    private String userName;

    @Column(nullable = false)
    private int likes = 0;

    @Column(nullable = false)
    private int flags = 0;

    @Column(nullable = false)
    private java.time.LocalDateTime createdAt;
}
