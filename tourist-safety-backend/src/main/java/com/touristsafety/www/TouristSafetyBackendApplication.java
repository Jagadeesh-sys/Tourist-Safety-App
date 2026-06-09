package com.touristsafety.www;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.touristsafety.www.entity.User;
import com.touristsafety.www.repository.UserRepository;

@SpringBootApplication
public class TouristSafetyBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TouristSafetyBackendApplication.class, args);
	}
	
	@Bean
	CommandLineRunner initDatabase(UserRepository userRepository) {
		return args -> {
			if (!userRepository.findByEmail("admin@touristsafety.com").isPresent()) {
				User admin = new User();
				admin.setName("Admin User");
				admin.setEmail("admin@touristsafety.com");
				admin.setPassword("admin123");
				admin.setRole("ADMIN");
				admin.setStatus("active");
				userRepository.save(admin);
				System.out.println("Default admin user created: admin@touristsafety.com / admin123");
			} else {
				System.out.println("Default admin user already exists");
			}
		};
	}

}
