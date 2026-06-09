package com.touristsafety.www.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.touristsafety.www.entity.User;
import com.touristsafety.www.repository.UserRepository;

import java.util.List;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    public User register(User user) {

        if (repository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already Exists");
        }

        // Set default role
        user.setRole("TOURIST");
        user.setStatus("active");

        return repository.save(user);
    }

    public User login(User user) {
        return repository
                .findByEmailAndPassword(
                        user.getEmail(),
                        user.getPassword())
                .orElse(null);
    }

    public User getProfileByEmail(String email) {
        return repository.findByEmail(email).orElse(null);
    }

    public User updateProfile(String email, Map<String, Object> updates) {
        User user = repository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        if (updates.containsKey("name")) user.setName((String) updates.get("name"));
        if (updates.containsKey("phone")) user.setPhone((String) updates.get("phone"));
        if (updates.containsKey("emergencyContactName")) user.setEmergencyContactName((String) updates.get("emergencyContactName"));
        if (updates.containsKey("emergencyContactPhone")) user.setEmergencyContactPhone((String) updates.get("emergencyContactPhone"));
        if (updates.containsKey("nationality")) user.setNationality((String) updates.get("nationality"));
        if (updates.containsKey("preferredLanguage")) user.setPreferredLanguage((String) updates.get("preferredLanguage"));
        
        return repository.save(user);
    }
    
    public List<User> getAllUsers() {
        return repository.findAll();
    }
}