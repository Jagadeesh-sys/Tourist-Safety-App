package com.touristsafety.www.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.touristsafety.www.service.TripService;
import com.touristsafety.www.service.SOSService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/safety")
@CrossOrigin(origins = "*")
public class SafetyController {

    @Autowired
    private TripService tripService;

    @Autowired
    private SOSService sosService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSafetyStats(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail) {
        
        Map<String, Object> stats = new HashMap<>();
        
        // Mock safety stats for now
        stats.put("safetyScore", 85);
        stats.put("activeAlerts", 1);
        
        Map<String, Object> response = new HashMap<>();
        response.put("data", stats);
        return ResponseEntity.ok(response);
    }
}
