package com.touristsafety.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.touristsafety.www.entity.CommunityPost;

import java.util.List;

public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {
    List<CommunityPost> findAllByOrderByCreatedAtDesc();
}
