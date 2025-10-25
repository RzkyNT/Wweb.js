const express = require('express');
const path = require('path');
const logger = require('./utils/logger');
const config = require('./utils/config');

class Dashboard {
    constructor(bot) {
        this.bot = bot;
        this.app = express();
        this.port = config.dashboard.port;
        
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

        this.app.get('/api/status', (req, res) => {
            const status = this.bot.getStatus();
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
    }

    start() {
        this.app.listen(this.port, '0.0.0.0', () => {
            logger.info(`📊 Dashboard running at http://0.0.0.0:${this.port}`);
        });
    }
}

module.exports = Dashboard;
