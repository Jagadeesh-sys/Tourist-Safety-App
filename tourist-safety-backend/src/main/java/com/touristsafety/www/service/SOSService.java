package com.touristsafety.www.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.touristsafety.www.entity.SOS;
import com.touristsafety.www.entity.OfficerCase;
import com.touristsafety.www.entity.User;
import com.touristsafety.www.repository.SOSRepository;
import com.touristsafety.www.repository.OfficerCaseRepository;

import java.util.List;

@Service
public class SOSService {

    @Autowired
    private SOSRepository sosRepository;

    @Autowired
    private OfficerCaseRepository officerCaseRepository;

    @Autowired
    private UserService userService;

    public SOS createSOS(SOS sos) {
        sos.setTime(java.time.LocalDateTime.now());
        
        // Set tourist name from user if available
        if (sos.getUserEmail() != null) {
            User user = userService.getProfileByEmail(sos.getUserEmail());
            if (user != null && (sos.getTourist() == null || sos.getTourist().isEmpty())) {
                sos.setTourist(user.getName());
            }
        }
        
        SOS savedSOS = sosRepository.save(sos);
        
        // Create officer case
        OfficerCase officerCase = new OfficerCase();
        officerCase.setCaseId("SOS-" + savedSOS.getId());
        officerCase.setTourist(sos.getTourist());
        officerCaseRepository.save(officerCase);
        
        return savedSOS;
    }

    public List<SOS> getMySOS(String userEmail) {
        return sosRepository.findByUserEmail(userEmail);
    }

    public List<SOS> getActiveSOS() {
        return sosRepository.findByStatus("active");
    }

    public List<SOS> getAllSOS() {
        return sosRepository.findAll();
    }
}
