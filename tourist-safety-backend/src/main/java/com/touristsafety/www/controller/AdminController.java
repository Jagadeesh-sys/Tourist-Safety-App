package com.touristsafety.www.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.touristsafety.www.entity.Trip;
import com.touristsafety.www.entity.User;
import com.touristsafety.www.entity.SOS;
import com.touristsafety.www.service.TripService;
import com.touristsafety.www.service.UserService;
import com.touristsafety.www.service.SOSService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private TripService tripService;
    
    @Autowired
    private SOSService sosService;
    
    @GetMapping("/admin/users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (User user : users) {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("name", user.getName());
            userMap.put("email", user.getEmail());
            userMap.put("role", user.getRole());
            userMap.put("status", user.getStatus());
            result.add(userMap);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("data", result);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/admin/trips")
    public ResponseEntity<Map<String, Object>> getAllTrips() {
        List<Trip> trips = tripService.getAllTrips();
        Map<String, Object> response = new HashMap<>();
        response.put("data", trips);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/analytics/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardMetrics() {
        List<User> users = userService.getAllUsers();
        List<Trip> trips = tripService.getAllTrips();
        List<SOS> sosList = sosService.getAllSOS();
        
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalTrips", trips.size());
        metrics.put("activeTourists", users.stream().filter(u -> "TOURIST".equals(u.getRole()) && "active".equals(u.getStatus())).count());
        metrics.put("sosRequests", sosList.size());
        metrics.put("safetyScore", 85);
        
        List<String> popularDestinations = new ArrayList<>();
        popularDestinations.add("Goa");
        popularDestinations.add("Jaipur");
        popularDestinations.add("Kerala");
        metrics.put("popularDestinations", popularDestinations);
        
        return ResponseEntity.ok(metrics);
    }
    
    @GetMapping("/analytics/charts")
    public ResponseEntity<Map<String, Object>> getChartData() {
        Map<String, Object> charts = new HashMap<>();
        
        Map<String, Object> tripsTrend = new HashMap<>();
        List<String> labels1 = new ArrayList<>();
        labels1.add("Jan");
        labels1.add("Feb");
        labels1.add("Mar");
        labels1.add("Apr");
        labels1.add("May");
        labels1.add("Jun");
        tripsTrend.put("labels", labels1);
        
        List<Integer> values1 = new ArrayList<>();
        values1.add(12);
        values1.add(19);
        values1.add(15);
        values1.add(22);
        values1.add(18);
        values1.add(25);
        tripsTrend.put("values", values1);
        charts.put("tripsTrend", tripsTrend);
        
        Map<String, Object> incidentTypes = new HashMap<>();
        List<String> labels2 = new ArrayList<>();
        labels2.add("Theft");
        labels2.add("Harassment");
        labels2.add("Accident");
        labels2.add("Lost");
        labels2.add("Other");
        incidentTypes.put("labels", labels2);
        
        List<Integer> values2 = new ArrayList<>();
        values2.add(5);
        values2.add(3);
        values2.add(2);
        values2.add(4);
        values2.add(1);
        incidentTypes.put("values", values2);
        charts.put("incidentTypes", incidentTypes);
        
        return ResponseEntity.ok(charts);
    }
    
    @GetMapping("/admin/sos")
    public ResponseEntity<Map<String, Object>> getAllSOS() {
        List<SOS> sosList = sosService.getAllSOS();
        Map<String, Object> response = new HashMap<>();
        response.put("data", sosList);
        return ResponseEntity.ok(response);
    }
}
