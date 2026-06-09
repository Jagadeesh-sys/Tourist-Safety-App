package com.touristsafety.www.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.touristsafety.www.entity.CommunityPost;
import com.touristsafety.www.repository.CommunityPostRepository;

import java.util.List;

@Service
public class CommunityPostService {

    @Autowired
    private CommunityPostRepository communityPostRepository;

    public CommunityPost createPost(String text, String userEmail, String userName) {
        CommunityPost post = new CommunityPost();
        post.setText(text);
        post.setUserEmail(userEmail);
        post.setUserName(userName);
        post.setCreatedAt(java.time.LocalDateTime.now());
        return communityPostRepository.save(post);
    }

    public List<CommunityPost> getAllPosts() {
        return communityPostRepository.findAllByOrderByCreatedAtDesc();
    }

    public CommunityPost likePost(Long id) {
        CommunityPost post = communityPostRepository.findById(id).orElse(null);
        if (post != null) {
            post.setLikes(post.getLikes() + 1);
            return communityPostRepository.save(post);
        }
        return null;
    }

    public CommunityPost flagPost(Long id) {
        CommunityPost post = communityPostRepository.findById(id).orElse(null);
        if (post != null) {
            post.setFlags(post.getFlags() + 1);
            return communityPostRepository.save(post);
        }
        return null;
    }
}
