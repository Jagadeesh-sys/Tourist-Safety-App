package com.touristsafety.www.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.touristsafety.www.entity.Trip;
import com.touristsafety.www.repository.TripRepository;

@Service
public class TripService {

    @Autowired
    private TripRepository repository;

    public Trip saveTrip(Trip trip) {
        return repository.save(trip);
    }

    public List<Trip> getAllTrips() {
        return repository.findAll();
    }

    public Trip getTripById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteTrip(Long id) {
        repository.deleteById(id);
    }
}