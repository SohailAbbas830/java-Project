# schema-design.md

## Overview
MySQL schema for Hospital Management (4+ tables): Doctor, Patient, Appointment, Admin (User).

## Tables

### Doctor
- `doctor_id` INT PRIMARY KEY AUTO_INCREMENT
- `first_name` VARCHAR(100) NOT NULL
- `last_name` VARCHAR(100) NOT NULL
- `speciality` VARCHAR(100)
- `email` VARCHAR(150) UNIQUE
- `phone` VARCHAR(20)
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### Patient
- `patient_id` INT PRIMARY KEY AUTO_INCREMENT
- `first_name` VARCHAR(100) NOT NULL
- `last_name` VARCHAR(100) NOT NULL
- `age` INT
- `gender` VARCHAR(10)
- `email` VARCHAR(150) UNIQUE
- `phone` VARCHAR(20)
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### Appointment
- `appointment_id` INT PRIMARY KEY AUTO_INCREMENT
- `doctor_id` INT NOT NULL
- `patient_id` INT NOT NULL
- `appointment_time` DATETIME NOT NULL
- `status` VARCHAR(20) DEFAULT 'SCHEDULED'
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- FOREIGN KEY (`doctor_id`) REFERENCES Doctor(`doctor_id`) ON DELETE CASCADE
- FOREIGN KEY (`patient_id`) REFERENCES Patient(`patient_id`) ON DELETE CASCADE

### Admin (User)
- `user_id` INT PRIMARY KEY AUTO_INCREMENT
- `username` VARCHAR(100) UNIQUE NOT NULL
- `password_hash` VARCHAR(255) NOT NULL
- `role` VARCHAR(20) -- e.g., ADMIN, STAFF
- `email` VARCHAR(150)
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

## Notes on relationships
- One Doctor can have many Appointments (1-to-many).
- One Patient can have many Appointments (1-to-many).
- Optionally create `doctor_available_times` table to store time slots if needed:
  - `id` INT PRIMARY KEY AUTO_INCREMENT
  - `doctor_id` INT, `available_time` DATETIME
  - FOREIGN KEY (`doctor_id`) REFERENCES Doctor(`doctor_id`)

## Example CREATE TABLE statements (MySQL)
```sql
CREATE TABLE Doctor (
  doctor_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  speciality VARCHAR(100),
  email VARCHAR(150) UNIQUE,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Patient (
  patient_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  age INT,
  gender VARCHAR(10),
  email VARCHAR(150) UNIQUE,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Appointment (
  appointment_id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT NOT NULL,
  patient_id INT NOT NULL,
  appointment_time DATETIME NOT NULL,
  status VARCHAR(20) DEFAULT 'SCHEDULED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE
);

CREATE TABLE AdminUser (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20),
  email VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
