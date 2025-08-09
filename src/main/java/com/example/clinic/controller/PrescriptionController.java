package com.example.clinic.controller;

import com.example.clinic.model.Prescription;
import com.example.clinic.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @PostMapping
    public ResponseEntity<?> savePrescription(
            @RequestBody Prescription prescription,
            @RequestHeader(value = "Authorization", required = false) String token) {

        if (token == null || !prescriptionService.validateToken(token)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or missing token"));
        }

        if (prescription.getPatientId() == null || prescription.getDetails() == null || prescription.getDetails().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing prescription details"));
        }

        Prescription saved = prescriptionService.savePrescription(prescription);
        return ResponseEntity.ok(saved);
    }
}
