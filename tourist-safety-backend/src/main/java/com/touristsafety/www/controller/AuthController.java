package com.touristsafety.www.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.touristsafety.www.entity.User;
import com.touristsafety.www.service.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
	
	@Autowired
	private UserService service;
	
	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody User user) {
		User saveUser = service.register(user);
		
		String token = java.util.UUID.randomUUID().toString();
		
		Map<String, Object> response = new HashMap<>();
		response.put("token", token);
		response.put("user", saveUser);
		
		return ResponseEntity.ok(response);
	}
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody User user) {
		User loggedUser = service.login(user);
		if(loggedUser != null) {
			String token = java.util.UUID.randomUUID().toString();
			
			Map<String, Object> response = new HashMap<>();
			response.put("token", token);
			response.put("user", loggedUser);
			
			return ResponseEntity.ok(response);
		}
		return ResponseEntity.badRequest()
				.body("Invalid Email and Password");
	}

}
