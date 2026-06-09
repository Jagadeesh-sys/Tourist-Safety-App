package com.touristsafety.www.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.touristsafety.www.entity.User;

public interface UserRepository extends JpaRepository<User, Long>{
	
	Optional<User> findByEmail(String email);
	Optional<User> findByEmailAndPassword(String email, String password);
	List<User> findAll();

}
