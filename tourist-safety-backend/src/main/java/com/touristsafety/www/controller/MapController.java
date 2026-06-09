package com.touristsafety.www.controller;

import java.util.*;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/maps")
public class MapController {

    @GetMapping("/safe-places")
    public Map<String, Object> getSafePlaces() {

        Map<String, Object> map = new HashMap<>();

        Map<String, Object> center = new HashMap<>();
        center.put("lat", 17.3850);
        center.put("lng", 78.4867);
        map.put("center", center);

        List<Map<String, Object>> markers = new ArrayList<>();
        Map<String, Object> marker1 = new HashMap<>();
        marker1.put("lat", 17.3850);
        marker1.put("lng", 78.4867);
        marker1.put("title", "Safe Hotel");
        markers.add(marker1);

        Map<String, Object> marker2 = new HashMap<>();
        marker2.put("lat", 17.4000);
        marker2.put("lng", 78.4900);
        marker2.put("title", "Hospital");
        markers.add(marker2);

        map.put("markers", markers);

        return map;
    }
}
