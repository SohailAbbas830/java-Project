package com.doctor.app.controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {
    @GetMapping
    public String getDoctors() {
        return "List of doctors";
    }
}