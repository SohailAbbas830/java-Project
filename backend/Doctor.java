
package com.example.doctorproject;

public class Doctor {
    private int id;
    private String name;
    private String specialty;
    private String phoneNumber;
    private String email;

    // Constructor
    public Doctor(int id, String name, String specialty, String phoneNumber, String email) {
        this.id = id;
        this.name = name;
        this.specialty = specialty;
        this.phoneNumber = phoneNumber;
        this.email = email;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // To String method
    @Override
    public String toString() {
        return "Doctor{" +
                "id=" + id +
                ", name='" + name + ''' +
                ", specialty='" + specialty + ''' +
                ", phoneNumber='" + phoneNumber + ''' +
                ", email='" + email + ''' +
                '}';
    }
}
