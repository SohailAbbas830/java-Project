package com.example.clinic.controller;

import com.example.clinic.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    // GET endpoint for doctor availability using dynamic parameters
    @GetMapping("/{doctorId}/availability")
    public ResponseEntity<?> getDoctorAvailability(
            @PathVariable Long doctorId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestHeader("Authorization") String token) {

        // Basic token validation logic delegated to service
        if (!doctorService.validateToken(token)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or missing token"));
        }

        return ResponseEntity.ok(doctorService.getAvailableSlots(doctorId, date));
    }
}
