// ==========================================================
// AUTH READY: DORMANT MIDDLEWARE
// This file is fully coded and ready to be used.
// To enable authentication, uncomment the require statement
// for this file in your routes and use authorize('role').
// ==========================================================

const jwt = require('jsonwebtoken');

// Verify JWT token and attach user payload to req
exports.verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    
    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1];
        
        jwt.verify(token, process.env.JWT_SECRET || 'bloodbank_super_secret_jwt_key_2024', (err, authData) => {
            if (err) {
                return res.status(403).json({ success: false, message: 'Invalid or expired token' });
            }
            req.user = authData;
            next();
        });
    } else {
        res.status(401).json({ success: false, message: 'Access Denied. No token provided.' });
    }
};

// Role-based authorization middleware
// Usage in route: router.get('/protected', authorize('admin'), controllerFunc)
exports.authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: 'Unauthorized access. You do not have the required permissions.' 
            });
        }
        next();
    };
};
