package com.touristsafety.www.controller;

import java.util.*;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @GetMapping("/landing")
    public Map<String, Object> getLanding() {

        Map<String, Object> response = new HashMap<>();

        List<Map<String, Object>> destinations = new ArrayList<>();
        Map<String, Object> dest1 = new HashMap<>();
        dest1.put("id", 1);
        dest1.put("name", "Hyderabad");
        dest1.put("image", "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600");
        dest1.put("rating", 4.8);
        dest1.put("reviews", 1200);
        destinations.add(dest1);

        Map<String, Object> dest2 = new HashMap<>();
        dest2.put("id", 2);
        dest2.put("name", "Goa");
        dest2.put("image", "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600");
        dest2.put("rating", 4.9);
        dest2.put("reviews", 1500);
        destinations.add(dest2);

        Map<String, Object> dest3 = new HashMap<>();
        dest3.put("id", 3);
        dest3.put("name", "Visakhapatnam");
        dest3.put("image", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600");
        dest3.put("rating", 4.8);
        dest3.put("reviews", 1600);
        destinations.add(dest3);

        Map<String, Object> dest4 = new HashMap<>();
        dest4.put("id", 4);
        dest4.put("name", "Kerala");
        dest4.put("image", "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600");
        dest4.put("rating", 4.9);
        dest4.put("reviews", 2100);
        destinations.add(dest4);

        Map<String, Object> dest5 = new HashMap<>();
        dest5.put("id", 5);
        dest5.put("name", "Manali");
        dest5.put("image", "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600");
        dest5.put("rating", 4.8);
        dest5.put("reviews", 1700);
        destinations.add(dest5);

        Map<String, Object> dest6 = new HashMap<>();
        dest6.put("id", 6);
        dest6.put("name", "Delhi");
        dest6.put("image", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600");
        dest6.put("rating", 4.7);
        dest6.put("reviews", 2500);
        destinations.add(dest6);

        Map<String, Object> dest7 = new HashMap<>();
        dest7.put("id", 7);
        dest7.put("name", "Agra");
        dest7.put("image", "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600");
        dest7.put("rating", 4.9);
        dest7.put("reviews", 3000);
        destinations.add(dest7);

        Map<String, Object> dest8 = new HashMap<>();
        dest8.put("id", 8);
        dest8.put("name", "Varanasi");
        dest8.put("image", "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=600");
        dest8.put("rating", 4.8);
        dest8.put("reviews", 2200);
        destinations.add(dest8);

        response.put("destinations", destinations);


        List<Map<String, Object>> safetyAlerts = new ArrayList<>();
        Map<String, Object> alert1 = new HashMap<>();
        alert1.put("title", "Heavy Rain Alert");
        alert1.put("time", "10 mins ago");
        alert1.put("icon", "rain");
        alert1.put("color", "blue");
        safetyAlerts.add(alert1);

        Map<String, Object> alert2 = new HashMap<>();
        alert2.put("title", "Road Block Warning");
        alert2.put("time", "30 mins ago");
        alert2.put("icon", "road");
        alert2.put("color", "orange");
        safetyAlerts.add(alert2);

        response.put("safetyAlerts", safetyAlerts);


        List<Map<String, Object>> emergencyServices = new ArrayList<>();
        Map<String, Object> service1 = new HashMap<>();
        service1.put("name", "Police");
        service1.put("number", "100");
        service1.put("action", "Call Now");
        service1.put("color", "blue");
        emergencyServices.add(service1);

        Map<String, Object> service2 = new HashMap<>();
        service2.put("name", "Ambulance");
        service2.put("number", "108");
        service2.put("action", "Call Now");
        service2.put("color", "red");
        emergencyServices.add(service2);

        response.put("emergencyServices", emergencyServices);


        List<Map<String, Object>> safePlaces = new ArrayList<>();
        Map<String, Object> place1 = new HashMap<>();
        place1.put("label", "Hotels");
        place1.put("count", "25");
        place1.put("icon", "hotel");
        safePlaces.add(place1);

        Map<String, Object> place2 = new HashMap<>();
        place2.put("label", "Hospitals");
        place2.put("count", "12");
        place2.put("icon", "hospital");
        safePlaces.add(place2);

        Map<String, Object> place3 = new HashMap<>();
        place3.put("label", "Police Stations");
        place3.put("count", "8");
        place3.put("icon", "police");
        safePlaces.add(place3);

        response.put("safePlaces", safePlaces);


        List<Map<String, Object>> travelGuide = new ArrayList<>();
        Map<String, Object> guide1 = new HashMap<>();
        guide1.put("title", "Travel Tips");
        guide1.put("subtitle", "Read More");
        guide1.put("icon", "tips");
        guide1.put("color", "blue");
        travelGuide.add(guide1);

        Map<String, Object> guide2 = new HashMap<>();
        guide2.put("title", "Local Laws");
        guide2.put("subtitle", "Read More");
        guide2.put("icon", "laws");
        guide2.put("color", "purple");
        travelGuide.add(guide2);

        response.put("travelGuide", travelGuide);


        List<Map<String, Object>> testimonials = new ArrayList<>();
        Map<String, Object> testimonial1 = new HashMap<>();
        testimonial1.put("name", "Rahul");
        testimonial1.put("text", "Very safe and useful platform.");
        testimonial1.put("avatar", "https://i.pravatar.cc/150?img=1");
        testimonials.add(testimonial1);

        Map<String, Object> testimonial2 = new HashMap<>();
        testimonial2.put("name", "Priya");
        testimonial2.put("text", "Helped me during my Goa trip.");
        testimonial2.put("avatar", "https://i.pravatar.cc/150?img=2");
        testimonials.add(testimonial2);

        Map<String, Object> testimonial3 = new HashMap<>();
        testimonial3.put("name", "Arjun");
        testimonial3.put("text", "Emergency contacts are very useful.");
        testimonial3.put("avatar", "https://i.pravatar.cc/150?img=3");
        testimonials.add(testimonial3);

        response.put("testimonials", testimonials);


        return response;
    }
}
