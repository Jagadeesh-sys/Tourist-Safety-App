package com.touristsafety.www.controller;

import java.util.*;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/geofence")
public class GeofenceController {

    @GetMapping("/alerts")
    public List<Map<String, Object>> getAlerts() {
        List<Map<String, Object>> alerts = new ArrayList<>();
        Map<String, Object> alert = new HashMap<>();
        alert.put("id", 1);
        alert.put("title", "High Risk Zone");
        alert.put("message", "Crime incidents reported nearby");
        alerts.add(alert);
        return alerts;
    }
}
