-- ==========================================================
-- Online Blood Bank System - Database Schema (NO-AUTH ACTIVE, BUT AUTH-READY)
-- ==========================================================

DROP DATABASE IF EXISTS bloodbank_db;
CREATE DATABASE bloodbank_db;
USE bloodbank_db;

-- 1. Users Table (Created for future Auth Readiness, currently dormant)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('donor', 'hospital', 'admin') NOT NULL,
    city VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Donors Table (Currently directly accessible without users relation)
CREATE TABLE donors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT,
    gender ENUM('Male', 'Female', 'Other'),
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    city VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    last_donation_date DATE,
    is_available BOOLEAN DEFAULT TRUE,
    medical_history TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Hospitals Table (Currently directly accessible without users relation)
CREATE TABLE hospitals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Blood Inventory Table
CREATE TABLE blood_inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blood_bank_name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    units_available INT DEFAULT 0,
    expiry_date DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Blood Requests Table
CREATE TABLE blood_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_name VARCHAR(255) NOT NULL,
    hospital_city VARCHAR(100) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    units_needed INT NOT NULL,
    urgency ENUM('Normal', 'Urgent', 'Critical') DEFAULT 'Normal',
    status ENUM('Pending', 'Matched', 'Fulfilled', 'Rejected') DEFAULT 'Pending',
    patient_name VARCHAR(255),
    patient_age INT,
    doctor_name VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Donations Table (Log of completed donations)
CREATE TABLE donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT NOT NULL,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    units INT DEFAULT 1,
    donation_date DATE NOT NULL,
    FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE CASCADE
);

-- 7. Donation Camps Table
CREATE TABLE donation_camps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    camp_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    organizer VARCHAR(255),
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    contact_phone VARCHAR(20),
    status ENUM('Upcoming', 'Active', 'Completed') DEFAULT 'Upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Notifications Table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, -- Links to users or role-based logic
    role VARCHAR(50), -- 'donor', 'hospital', 'admin'
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
