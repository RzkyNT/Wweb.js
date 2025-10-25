require('dotenv').config();
const WhatsAppBot = require('./src/bot');
const Dashboard = require('./src/dashboard');
const logger = require('./src/utils/logger');

async function main() {
    try {
        logger.info('===========================================');
        logger.info('🚀 Starting WhatsApp Bot Application');
        logger.info('===========================================');

        const bot = new WhatsAppBot();
        
        logger.info('📱 Initializing WhatsApp connection...');
        bot.start();

        if (process.env.DASHBOARD_ENABLED !== 'false') {
            logger.info('📊 Starting Dashboard...');
            const dashboard = new Dashboard(bot);
            dashboard.start();
        }

        process.on('SIGINT', async () => {
            logger.info('\n👋 Shutting down gracefully...');
            await bot.getClient().destroy();
            process.exit(0);
        });

    } catch (error) {
        logger.error('Fatal error: ' + error.message);
        process.exit(1);
    }
}

main();
