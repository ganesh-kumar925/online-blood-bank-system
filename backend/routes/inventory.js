const express = require('express');
const router = express.Router();
const db = require('../models/db');

// ==========================================================
// AUTH READY: Uncomment the lines below to enable auth logic
// const { verifyToken, authorize } = require('../middleware/authMiddleware');
// ==========================================================

/**
 * GET /api/inventory
 * Description: Get all blood inventory grouped by bank and type
 * AUTH READY: To protect this route, change to: router.get('/', verifyToken, authorize('admin'), async (req, res) => {
 */
router.get('/', async (req, res) => {
    try {
        const [inventory] = await db.execute(`
            SELECT 
                blood_bank_name, city, blood_type, units_available, expiry_date,
                CASE WHEN expiry_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END AS expiry_warning 
            FROM blood_inventory
            ORDER BY units_available ASC
        `);

        // Group data for the Chart.js Admin UI
        const [aggregated] = await db.execute(`
            SELECT blood_type, SUM(units_available) as total_units 
            FROM blood_inventory 
            GROUP BY blood_type
        `);

        const chartData = {};
        aggregated.forEach(a => chartData[a.blood_type] = Number(a.total_units));

        res.json({ success: true, inventory, aggregated: chartData });
    } catch (err) {
        console.error('Inventory Fetch Error:', err);
        res.status(500).json({ success: false, message: 'Server error retrieving inventory' });
    }
});

/**
 * GET /api/inventory/critical
 * Description: Identify critical shortages (Less than 5 units) sitewide.
 */
router.get('/critical', async (req, res) => {
    try {
        const [critical] = await db.execute(`
            SELECT city, blood_type, SUM(units_available) as total 
            FROM blood_inventory 
            GROUP BY city, blood_type 
            HAVING total < 5
        `);
        res.json({ success: true, alerts: critical });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error retrieving critical alerts' });
    }
});

module.exports = router;
