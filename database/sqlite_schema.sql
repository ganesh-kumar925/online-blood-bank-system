-- ==========================================================
-- Online Blood Bank System - SQLite Database Schema
-- ================== (MIGRATED FROM MYSQL) ==================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('donor', 'hospital', 'admin')) NOT NULL,
    city TEXT,
    phone TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Donors Table
CREATE TABLE IF NOT EXISTS donors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT CHECK(gender IN ('Male', 'Female', 'Other')),
    blood_type TEXT CHECK(blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')) NOT NULL,
    city TEXT,
    phone TEXT,
    email TEXT,
    last_donation_date DATE,
    is_available BOOLEAN DEFAULT 1,
    medical_history TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Hospitals Table
CREATE TABLE IF NOT EXISTS hospitals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hospital_name TEXT NOT NULL,
    city TEXT NOT NULL,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Blood Inventory Table
CREATE TABLE IF NOT EXISTS blood_inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    blood_bank_name TEXT NOT NULL,
    city TEXT NOT NULL,
    blood_type TEXT CHECK(blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')) NOT NULL,
    units_available INTEGER DEFAULT 0,
    expiry_date DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Blood Requests Table
CREATE TABLE IF NOT EXISTS blood_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hospital_name TEXT NOT NULL,
    hospital_city TEXT NOT NULL,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    blood_type TEXT CHECK(blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')) NOT NULL,
    units_needed INTEGER NOT NULL,
    urgency TEXT CHECK(urgency IN ('Normal', 'Urgent', 'Critical')) DEFAULT 'Normal',
    status TEXT CHECK(status IN ('Pending', 'Matched', 'Fulfilled', 'Rejected')) DEFAULT 'Pending',
    patient_name TEXT,
    patient_age INTEGER,
    doctor_name TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Donations Table
CREATE TABLE IF NOT EXISTS donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_id INTEGER NOT NULL,
    blood_type TEXT CHECK(blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')) NOT NULL,
    units INTEGER DEFAULT 1,
    donation_date DATE NOT NULL,
    FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE CASCADE
);

-- 7. Donation Camps Table
CREATE TABLE IF NOT EXISTS donation_camps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    camp_name TEXT NOT NULL,
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    organizer TEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    contact_phone TEXT,
    status TEXT CHECK(status IN ('Upcoming', 'Active', 'Completed')) DEFAULT 'Upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    role TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
