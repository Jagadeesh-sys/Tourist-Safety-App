package com.touristsafety.www.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.touristsafety.www.entity.User;
import com.touristsafety.www.service.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> getProfile(@RequestHeader(value = "X-User-Email", required = false) String email) {
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("User email not found");
        }

        User user = userService.getProfileByEmail(email);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("phone", user.getPhone());
        response.put("emergencyContactName", user.getEmergencyContactName());
        response.put("emergencyContactPhone", user.getEmergencyContactPhone());
        response.put("nationality", user.getNationality());
        response.put("preferredLanguage", user.getPreferredLanguage());
        response.put("memberSince", "2024-01-01"); // Mock value for now

        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @RequestBody Map<String, Object> updates) {
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("User email not found");
        }

        try {
            User updatedUser = userService.updateProfile(email, updates);

            Map<String, Object> response = new HashMap<>();
            response.put("id", updatedUser.getId());
            response.put("name", updatedUser.getName());
            response.put("email", updatedUser.getEmail());
            response.put("role", updatedUser.getRole());
            response.put("phone", updatedUser.getPhone());
            response.put("emergencyContactName", updatedUser.getEmergencyContactName());
            response.put("emergencyContactPhone", updatedUser.getEmergencyContactPhone());
            response.put("nationality", updatedUser.getNationality());
            response.put("preferredLanguage", updatedUser.getPreferredLanguage());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
