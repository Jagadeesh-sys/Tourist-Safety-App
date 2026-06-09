package com.touristsafety.www.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.touristsafety.www.entity.OfficerCase;
import com.touristsafety.www.repository.OfficerCaseRepository;
import com.touristsafety.www.service.SOSService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/officer")
@CrossOrigin(origins = "http://localhost:5173")
public class OfficerController {

    @Autowired
    private OfficerCaseRepository officerCaseRepository;

    @Autowired
    private SOSService sosService;

    @GetMapping("/cases")
    public List<OfficerCase> getCases() {
        return officerCaseRepository.findAll();
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("assignedCases", officerCaseRepository.count());
        stats.put("activeSos", sosService.getActiveSOS().size());
        stats.put("openIncidents", 0);
        return stats;
    }
}
