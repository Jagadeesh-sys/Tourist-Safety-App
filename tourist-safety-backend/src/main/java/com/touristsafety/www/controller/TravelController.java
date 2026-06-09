package com.touristsafety.www.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/travel")
@CrossOrigin(origins = "*")
public class TravelController {

    @GetMapping("/attractions")
    public ResponseEntity<Map<String, Object>> getAttractions() {
        List<Map<String, Object>> attractions = new ArrayList<>();
        
        Map<String, Object> a1 = new HashMap<>();
        a1.put("id", 1);
        a1.put("name", "Charminar");
        a1.put("lat", 17.3616);
        a1.put("lng", 78.4746);
        attractions.add(a1);
        
        Map<String, Object> a2 = new HashMap<>();
        a2.put("id", 2);
        a2.put("name", "Golconda Fort");
        a2.put("lat", 17.3833);
        a2.put("lng", 78.4011);
        attractions.add(a2);
        
        Map<String, Object> response = new HashMap<>();
        response.put("data", attractions);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/hotels")
    public ResponseEntity<Map<String, Object>> getHotels() {
        List<Map<String, Object>> hotels = new ArrayList<>();
        
        Map<String, Object> h1 = new HashMap<>();
        h1.put("id", 1);
        h1.put("name", "Taj Krishna");
        h1.put("lat", 17.4125);
        h1.put("lng", 78.4578);
        hotels.add(h1);
        
        Map<String, Object> response = new HashMap<>();
        response.put("data", hotels);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/restaurants")
    public ResponseEntity<Map<String, Object>> getRestaurants() {
        List<Map<String, Object>> restaurants = new ArrayList<>();
        
        Map<String, Object> r1 = new HashMap<>();
        r1.put("id", 1);
        r1.put("name", "Paradise Biryani");
        r1.put("lat", 17.4239);
        r1.put("lng", 78.4523);
        restaurants.add(r1);
        
        Map<String, Object> response = new HashMap<>();
        response.put("data", restaurants);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/ai/chat")
    public ResponseEntity<Map<String, Object>> aiChat(@RequestBody Map<String, Object> payload) {
        String message = ((String) payload.get("message")).toLowerCase();
        String reply = "Hi there! I'm your safety travel assistant. Ask me about trip planning or safety tips!";
        
        if (message.contains("goa")) {
            reply = "Great choice for Goa! Here's a safe plan:\n1. Stay in Baga or Calangute\n2. Avoid isolated beaches after 9 PM\n3. Use registered pre-paid taxis only\n4. Emergency: Keep 100/108 handy";
        } else if (message.contains("plan") || message.contains("trip")) {
            reply = "Let's plan your safe trip! First, tell me your destination and dates, and I'll help with safe accommodations and routes!";
        } else if (message.contains("dark") || message.contains("night") || message.contains("safe")) {
            reply = "Night safety tips:\n1. Travel in groups\n2. Stick to well-lit areas\n3. Keep phone charged & GPS on\n4. Use ride-sharing apps with live tracking";
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("reply", reply);
        
        Map<String, Object> response = new HashMap<>();
        response.put("data", result);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/routes/recommendation")
    public ResponseEntity<Map<String, Object>> getRouteRecommendation() {
        Map<String, Object> route = new HashMap<>();
        route.put("distance", "24 km");
        route.put("duration", "42 min");
        route.put("safetyNote", "Route avoids high-risk zones");
        route.put("steps", Arrays.asList("Start at current location", "Via main road", "Arrive at destination"));
        
        Map<String, Object> center = new HashMap<>();
        center.put("lat", 17.3616);
        center.put("lng", 78.4746);
        route.put("center", center);
        
        Map<String, Object> marker = new HashMap<>();
        marker.put("id", 1);
        marker.put("lat", 17.3616);
        marker.put("lng", 78.4746);
        marker.put("label", "Charminar");
        route.put("markers", Arrays.asList(marker));
        
        Map<String, Object> response = new HashMap<>();
        response.put("data", route);
        return ResponseEntity.ok(response);
    }
}
