package com.example.clinic.service;

import com.example.clinic.model.Prescription;
import com.example.clinic.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    // Simple token validation stub
    public boolean validateToken(String token) {
        return token != null && token.startsWith("Bearer ");
    }

    public Prescription savePrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }
}
