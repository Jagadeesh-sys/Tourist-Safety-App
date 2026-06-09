package com.touristsafety.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.touristsafety.www.entity.Trip;

public interface TripRepository extends JpaRepository<Trip, Long> {

}
