-- ==========================================================
-- Online Blood Bank System - SQLite Seed Data
-- ================== (MIGRATED FROM MYSQL) ==================

-- 1. Users
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

-- 4. Blood Inventory
INSERT INTO blood_inventory (blood_bank_name, city, blood_type, units_available, expiry_date) VALUES
('Red Cross Mumbai', 'Mumbai', 'O+', 45, date('now', '+14 days')),
('Red Cross Mumbai', 'Mumbai', 'A-', 2, date('now', '+5 days')),
('Lions Club Bank', 'Mumbai', 'B+', 30, date('now', '+20 days')),
('Apollo In-house Bank', 'Mumbai', 'O-', 0, date('now', '+30 days')),
('Rotary Blood Bank', 'Delhi', 'A+', 55, date('now', '+25 days')),
('Rotary Blood Bank', 'Delhi', 'B-', 4, date('now', '+3 days')),
('AIIMS Blood Center', 'Delhi', 'O+', 60, date('now', '+18 days')),
('Life Drop Blood Bank', 'Bangalore', 'O+', 35, date('now', '+15 days')),
('Narayana Bank', 'Bangalore', 'A-', 1, date('now', '+8 days')),
('Jeevan Blood Bank', 'Chennai', 'O-', 3, date('now', '+6 days')),
('Chiranjeevi Blood Bank', 'Hyderabad', 'A+', 40, date('now', '+21 days'));

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

-- 7. Donation Camps
INSERT INTO donation_camps (camp_name, location, city, organizer, start_date, end_date, contact_phone, status) VALUES
('Mega Blood Drive 2024', 'Marine Drive Ground', 'Mumbai', 'Red Cross Society', datetime('now', '+2 days'), datetime('now', '+2 days'), '9876543210', 'Upcoming'),
('Life Drop Camp - Delhi', 'Central Park', 'Delhi', 'Apollo Hospitals', datetime('now'), datetime('now', '+5 hours'), '9123456789', 'Active'),
('Corporate Donation Week', 'Hitech City IT Park', 'Hyderabad', 'Microsoft HR', datetime('now', '+10 days'), datetime('now', '+12 days'), '9988776655', 'Upcoming'),
('Community Blood Camp', 'Salt Lake Sector 5', 'Kolkata', 'Local Welfare Trust', datetime('now', '-15 days'), datetime('now', '-15 days'), '9000000000', 'Completed');

-- 8. Notifications
INSERT INTO notifications (role, message) VALUES
('donor', 'Urgent need for O+ blood in Mumbai. Check the inventory list!'),
('hospital', 'Your request REQ-1002 has been matched with 3 compatible donors.'),
('admin', 'New hospital registration request from City Hospital, Pune.');
