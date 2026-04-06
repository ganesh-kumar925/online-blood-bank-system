const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Set up static files for the frontend
app.use(express.static('../frontend'));

// ---------------------------------------------------------
// AUTH READY: Uncomment the lines below to enable 
// authentication routes and middleware later.
// ---------------------------------------------------------
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const authRoutes = require('./routes/auth');
// app.use('/api/auth', authRoutes);

// Import Routes
const bloodRoutes = require('./routes/blood');
const donorRoutes = require('./routes/donors');
const requestRoutes = require('./routes/requests');
const inventoryRoutes = require('./routes/inventory');
const chatbotRoutes = require('./routes/chatbot');
const campsRoutes = require('./routes/camps');
const statsRoutes = require('./routes/stats'); // Adding the stats route
const notificationsRoutes = require('./routes/notifications'); // Notifications

// Mount Routes (NO AUTH CURRENTLY ACTIVE)
app.use('/api/blood', bloodRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/camps', campsRoutes);
app.use('/api/stats', statsRoutes); // Allows GET /api/stats
app.use('/api/notifications', notificationsRoutes); // Notifications

// Basic health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Online', message: 'Life Drop API is running. (Auth Ready)' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Auth-Ready configuration active. Login not required.`);
});
