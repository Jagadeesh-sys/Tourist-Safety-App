package com.touristsafety.www.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.touristsafety.www.entity.SOS;
import com.touristsafety.www.service.SOSService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SOSController {

    @Autowired
    private SOSService sosService;

    @PostMapping("/sos")
    public ResponseEntity<Map<String, Object>> triggerSOS(@RequestBody SOS sos, @RequestHeader(value = "X-User-Email", required = false) String userEmail) {
        if (userEmail != null) {
            sos.setUserEmail(userEmail);
        }
        SOS savedSOS = sosService.createSOS(sos);
        Map<String, Object> response = new HashMap<>();
        response.put("data", savedSOS);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sos/my")
    public ResponseEntity<Map<String, Object>> getMySOS(@RequestHeader(value = "X-User-Email", required = false) String userEmail) {
        List<SOS> sosList;
        if (userEmail == null) {
            sosList = new ArrayList<>();
        } else {
            sosList = sosService.getMySOS(userEmail);
        }
        Map<String, Object> response = new HashMap<>();
        response.put("data", sosList);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sos/active")
    public ResponseEntity<Map<String, Object>> getActiveSOS() {
        List<SOS> sosList = sosService.getActiveSOS();
        Map<String, Object> response = new HashMap<>();
        response.put("data", sosList);
        return ResponseEntity.ok(response);
    }
}
