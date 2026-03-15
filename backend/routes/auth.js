// ==========================================================
// AUTH READY: DORMANT ROUTES
// This file contains fully functional authentication logic.
// It is NOT mounted in server.js currently.
// Uncomment `app.use('/api/auth', authRoutes)` in server.js to activate.
// ==========================================================

const express = require('express');
const router = express.Router();
const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password, role, city, phone } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    try {
        // Check if user already exists
        const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already registered.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert into Users table
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password_hash, role, city, phone) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role, city, phone]
        );

        res.status(201).json({ 
            success: true, 
            message: 'Registration successful! You can now log in.',
            userId: result.insertId
        });

    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const user = users[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        // Generate JWT
        const payload = {
            id: user.id,
            role: user.role,
            email: user.email
        };

        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET || 'bloodbank_super_secret_jwt_key_2024', 
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                city: user.city
            }
        });

    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ success: false, message: 'Server error during login.' });
    }
});

module.exports = router;
