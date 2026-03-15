-- ==========================================================
-- Realistic Seed Data (Updated Auth-Ready version without dependencies)
-- ==========================================================

USE bloodbank_db;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE donations;
TRUNCATE TABLE blood_requests;
TRUNCATE TABLE blood_inventory;
TRUNCATE TABLE hospitals;
TRUNCATE TABLE donors;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users (DORMANT - Created to be auth-ready later)
INSERT INTO users (id, name, email, password_hash, role, city, phone) VALUES
(1, 'System Admin', 'admin@bloodbank.in', '$2a$10$X8O.U/bMw.XjA31eQ01pruR/sR7nU/mIdwKxX21z17Vp4R.8l/hW.', 'admin', 'Delhi', '9876543210');

-- 2. Donors Details
INSERT INTO donors (id, name, age, gender, blood_type, city, phone, email, is_available, last_donation_date) VALUES
(1, 'Rahul Sharma', 28, 'Male', 'O+', 'Mumbai', '9812345678', 'rahul@email.com', 1, '2023-11-15'),
(2, 'Priya Patel', 24, 'Female', 'A-', 'Mumbai', '9823456789', 'priya@email.com', 1, '2024-01-10'),
(3, 'Arjun Reddy', 32, 'Male', 'B+', 'Delhi', '9834567890', 'arjun@email.com', 1, '2023-09-05'),
(4, 'Sneha Iyer', 29, 'Female', 'AB+', 'Bangalore', '9845678901', 'sneha@email.com', 1, NULL),
(5, 'Vikram Singh', 35, 'Male', 'O-', 'Chennai', '9856789012', 'vikram@email.com', 1, '2023-12-20'),
(6, 'Kavya Rao', 26, 'Female', 'A+', 'Hyderabad', '9867890123', 'kavya@email.com', 0, '2024-02-28');

-- 3. Hospitals Details
INSERT INTO hospitals (id, hospital_name, city, contact_person, phone, email) VALUES
(1, 'Apollo Hospitals', 'Mumbai', 'Dr. Ramesh', '022-1234567', 'apollo.mumbai@health.in'),
(2, 'Fortis Healthcare', 'Delhi', 'Dr. Suresh', '011-8765432', 'fortis.delhi@health.in'),
(3, 'Manipal Hospital', 'Bangalore', 'Dr. Pooja', '080-3456789', 'manipal.blr@health.in');

-- 4. Blood Inventory (Simulating realistic levels with some critical/expiring stock)
INSERT INTO blood_inventory (blood_bank_name, city, blood_type, units_available, expiry_date) VALUES
('Red Cross Mumbai', 'Mumbai', 'O+', 45, DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
('Red Cross Mumbai', 'Mumbai', 'A-', 2, DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
('Lions Club Bank', 'Mumbai', 'B+', 30, DATE_ADD(CURDATE(), INTERVAL 20 DAY)),
('Apollo In-house Bank', 'Mumbai', 'O-', 0, DATE_ADD(CURDATE(), INTERVAL 30 DAY)),
('Rotary Blood Bank', 'Delhi', 'A+', 55, DATE_ADD(CURDATE(), INTERVAL 25 DAY)),
('Rotary Blood Bank', 'Delhi', 'B-', 4, DATE_ADD(CURDATE(), INTERVAL 3 DAY)),
('AIIMS Blood Center', 'Delhi', 'O+', 60, DATE_ADD(CURDATE(), INTERVAL 18 DAY)),
('Life Drop Blood Bank', 'Bangalore', 'O+', 35, DATE_ADD(CURDATE(), INTERVAL 15 DAY)),
('Narayana Bank', 'Bangalore', 'A-', 1, DATE_ADD(CURDATE(), INTERVAL 8 DAY)),
('Jeevan Blood Bank', 'Chennai', 'O-', 3, DATE_ADD(CURDATE(), INTERVAL 6 DAY)),
('Chiranjeevi Blood Bank', 'Hyderabad', 'A+', 40, DATE_ADD(CURDATE(), INTERVAL 21 DAY));

-- 5. Blood Requests 
INSERT INTO blood_requests (hospital_name, hospital_city, contact_person, phone, email, blood_type, units_needed, urgency, status, patient_name) VALUES
('Apollo Hospitals', 'Mumbai', 'Dr. Ramesh', '022-1234567', 'apollo.mumbai@health.in', 'A-', 3, 'Critical', 'Pending', 'Anil Kumar'),
('Fortis Healthcare', 'Delhi', 'Dr. Suresh', '011-8765432', 'fortis.delhi@health.in', 'O+', 5, 'Normal', 'Pending', 'Suresh Kumar'),
('Manipal Hospital', 'Bangalore', 'Dr. Pooja', '080-3456789', 'manipal.blr@health.in', 'AB+', 2, 'Urgent', 'Matched', 'Pooja Reddy'),
('AIIMS Chennai', 'Chennai', 'Dr. Admin', '044-6789012', 'aiims.chennai@health.in', 'O-', 4, 'Critical', 'Pending', 'Anjali Desai'),
('Care Hospitals', 'Hyderabad', 'Dr. Admin', '040-2345678', 'care.hyd@health.in', 'B-', 1, 'Normal', 'Fulfilled', 'Abdul Khan');

-- 6. Donations 
INSERT INTO donations (donor_id, blood_type, units, donation_date) VALUES
(1, 'O+', 1, '2023-11-15'),
(2, 'A-', 1, '2024-01-10'),
(3, 'B+', 1, '2023-09-05'),
(5, 'O-', 1, '2023-12-20');
