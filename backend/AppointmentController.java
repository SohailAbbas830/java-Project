package com.doctor.app.controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    @PostMapping
    public String bookAppointment() {
        return "Appointment booked successfully";
    }
}