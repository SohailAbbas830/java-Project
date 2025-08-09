package com.example.clinic.service;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class DoctorService {

    // Validate token (stub - in real app use TokenService)
    public boolean validateToken(String token) {
        if (token == null || !token.startsWith("Bearer ")) return false;
        return true;
    }

    // Return available time slots for a doctor on a given date
    public List<Map<String, String>> getAvailableSlots(Long doctorId, LocalDate date) {
        // Example: return a few dummy slots
        List<Map<String, String>> slots = new ArrayList<>();
        slots.add(Map.of("slot", "09:00", "status", "available"));
        slots.add(Map.of("slot", "10:00", "status", "booked"));
        slots.add(Map.of("slot", "11:00", "status", "available"));
        return slots;
    }

    // Validate doctor login credentials (simple example)
    public boolean validateDoctorCredentials(String username, String password) {
        // In real app check hashed password from DB
        return "doctor".equals(username) && "password".equals(password);
    }
}
