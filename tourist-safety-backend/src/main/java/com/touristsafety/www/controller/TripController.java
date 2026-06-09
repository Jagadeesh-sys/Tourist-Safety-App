package com.touristsafety.www.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import com.touristsafety.www.entity.Trip;
import com.touristsafety.www.service.TripService;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "*")
public class TripController {

    @Autowired
    private TripService service;

    @PostMapping
    public Trip createTrip(@RequestBody Trip trip) {
        return service.saveTrip(trip);
    }

    @GetMapping
    public List<Trip> getAllTrips() {
        return service.getAllTrips();
    }

    @GetMapping("/my")
    public List<Trip> getMyTrips() {
        return service.getAllTrips();
    }

    @GetMapping("/{id}")
    public Trip getTrip(@PathVariable Long id) {
        return service.getTripById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteTrip(@PathVariable Long id) {
        service.deleteTrip(id);
        return "Trip Deleted Successfully";
    }
}
