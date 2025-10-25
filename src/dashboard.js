const express = require('express');
const path = require('path');
const logger = require('./utils/logger');
const configManager = require('./utils/configManager');
const { authenticate, login, logout } = require('./middleware/auth');

class Dashboard {
    constructor(bot) {
        this.bot = bot;
        this.app = express();
        this.port = configManager.getConfig().dashboard.port;
        
        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        this.app.use(express.static(path.join(__dirname, '../public')));
        this.app.use(express.json());
    }

    setupRoutes() {
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/index.html'));
        });

        this.app.get('/admin', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/admin.html'));
        });

        this.app.get('/api/status', (req, res) => {
            const status = this.bot.getStatus();
            const config = configManager.getConfig();
            res.json({
                success: true,
                data: {
                    botName: config.bot.name,
                    ready: status.ready,
                    stats: status.stats,
                    features: config.features,
                    timestamp: new Date().toISOString(),
                }
            });
        });

        this.app.get('/api/logs', (req, res) => {
            const stats = logger.getStats();
            res.json({
                success: true,
                data: stats
            });
        });

        this.app.post('/api/broadcast', async (req, res) => {
            try {
                const { message } = req.body;
                
                if (!message) {
                    return res.status(400).json({
                        success: false,
                        message: 'Message is required'
                    });
                }

                res.json({
                    success: true,
                    message: 'Broadcast feature available via WhatsApp command: !broadcast'
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });

        this.app.post('/api/admin/login', (req, res) => {
            try {
                const { username, password } = req.body;
                const result = login(username, password);
                
                if (result.success) {
                    res.json(result);
                } else {
                    res.status(401).json(result);
                }
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });

        this.app.post('/api/admin/logout', authenticate, (req, res) => {
            const sessionId = req.headers['x-session-id'];
            res.json(logout(sessionId));
        });

        this.app.get('/api/admin/config', authenticate, (req, res) => {
            try {
                const config = configManager.getConfig();
                res.json({
                    success: true,
                    data: config
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });

        this.app.post('/api/admin/config', authenticate, (req, res) => {
            try {
                const newConfig = req.body;
                const result = configManager.saveConfig(newConfig);
                res.json(result);
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });

        this.app.post('/api/admin/config/reset', authenticate, (req, res) => {
            try {
                const result = configManager.resetToDefault();
                res.json(result);
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });
    }

    start() {
        this.app.listen(this.port, '0.0.0.0', () => {
            logger.info(`📊 Dashboard running at http://0.0.0.0:${this.port}`);
        });
    }
}

module.exports = Dashboard;
