package com.touristsafety.www.controller;

import java.util.*;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @GetMapping
    public List<Map<String, Object>> getNotifications() {
        List<Map<String, Object>> notifications = new ArrayList<>();
        Map<String, Object> notification = new HashMap<>();
        notification.put("id", 1);
        notification.put("title", "Welcome");
        notification.put("message", "Tourist Safety Platform started successfully");
        notifications.add(notification);
        return notifications;
    }
}
