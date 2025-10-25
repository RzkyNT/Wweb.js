const crypto = require('crypto');
const logger = require('../utils/logger');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

if (ADMIN_USERNAME === 'admin' && ADMIN_PASSWORD === 'admin123') {
    logger.error('⚠️  WARNING: Using default admin credentials! Please set ADMIN_USERNAME and ADMIN_PASSWORD environment variables for security.');
    console.warn('\n⚠️  SECURITY WARNING: Default admin credentials detected!');
    console.warn('   Please set environment variables:');
    console.warn('   - ADMIN_USERNAME');
    console.warn('   - ADMIN_PASSWORD\n');
}

const sessions = new Map();

function generateSessionId() {
    return crypto.randomBytes(32).toString('hex');
}

function authenticate(req, res, next) {
    const sessionId = req.headers['x-session-id'] || req.query.session;
    
    if (!sessionId || !sessions.has(sessionId)) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized - Please login first'
        });
    }

    const session = sessions.get(sessionId);
    if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
        sessions.delete(sessionId);
        return res.status(401).json({
            success: false,
            message: 'Session expired - Please login again'
        });
    }

    req.user = session.user;
    next();
}

function login(username, password) {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const sessionId = generateSessionId();
        sessions.set(sessionId, {
            user: username,
            createdAt: Date.now()
        });
        return { success: true, sessionId };
    }
    return { success: false, message: 'Invalid credentials' };
}

function logout(sessionId) {
    sessions.delete(sessionId);
    return { success: true, message: 'Logged out successfully' };
}

module.exports = {
    authenticate,
    login,
    logout
};
