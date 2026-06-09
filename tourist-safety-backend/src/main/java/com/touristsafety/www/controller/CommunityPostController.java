package com.touristsafety.www.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.touristsafety.www.entity.CommunityPost;
import com.touristsafety.www.service.CommunityPostService;

import java.util.List;

@RestController
@RequestMapping("/api/community")
@CrossOrigin(origins = "http://localhost:5173")
public class CommunityPostController {

    @Autowired
    private CommunityPostService communityPostService;

    @GetMapping("/posts")
    public List<CommunityPost> getAllPosts() {
        return communityPostService.getAllPosts();
    }

    @PostMapping("/posts")
    public CommunityPost createPost(@RequestBody CreatePostRequest request) {
        return communityPostService.createPost(request.text, request.userEmail, request.userName);
    }

    @PostMapping("/posts/{id}/like")
    public CommunityPost likePost(@PathVariable Long id) {
        return communityPostService.likePost(id);
    }

    @PostMapping("/posts/{id}/flag")
    public CommunityPost flagPost(@PathVariable Long id) {
        return communityPostService.flagPost(id);
    }

    public static class CreatePostRequest {
        public String text;
        public String userEmail;
        public String userName;
    }
}
