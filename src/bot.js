require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const logger = require('./utils/logger');
const configManager = require('./utils/configManager');
const MessageHandler = require('./handlers/messageHandler');
const GroupHandler = require('./handlers/groupHandler');
const { execSync } = require('child_process');

class WhatsAppBot {
    constructor() {
        let chromiumPath;
        try {
            chromiumPath = execSync('which chromium').toString().trim();
            logger.info(`Using system Chromium at: ${chromiumPath}`);
        } catch (error) {
            logger.info('System Chromium not found, using bundled version');
        }

        this.client = new Client({
            authStrategy: new LocalAuth({
                dataPath: '.wwebjs_auth'
            }),
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ],
                executablePath: chromiumPath || undefined,
            }
        });

        this.messageHandler = new MessageHandler(this.client);
        this.groupHandler = new GroupHandler(this.client);
        this.isReady = false;
        
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.client.on('qr', (qr) => {
            logger.info('QR Code received! Scan untuk login:');
            qrcode.generate(qr, { small: true });
            console.log('\n📱 Scan QR code di atas dengan WhatsApp Anda');
        });

        this.client.on('authenticated', () => {
            logger.info('✅ Authenticated successfully!');
        });

        this.client.on('auth_failure', (msg) => {
            logger.error('❌ Authentication failed: ' + msg);
        });

        this.client.on('ready', () => {
            this.isReady = true;
            const config = configManager.getConfig();
            logger.info('🚀 Bot is ready and connected!');
            logger.info(`Bot Name: ${config.bot.name}`);
            logger.info(`Features: AI Chat, Auto Reply, Group Management, Media Support, Broadcast`);
        });

        this.client.on('message', async (msg) => {
            if (this.isReady) {
                await this.messageHandler.handleMessage(msg);
            }
        });

        this.client.on('group_join', async (notification) => {
            const config = configManager.getConfig();
            if (this.isReady && config.features.groupManagement) {
                await this.groupHandler.handleGroupJoin(notification);
            }
        });

        this.client.on('group_leave', async (notification) => {
            const config = configManager.getConfig();
            if (this.isReady && config.features.groupManagement) {
                await this.groupHandler.handleGroupLeave(notification);
            }
        });

        this.client.on('disconnected', (reason) => {
            logger.error('❌ Client was logged out: ' + reason);
            this.isReady = false;
        });

        this.client.on('message_create', async (msg) => {
            if (msg.fromMe) {
                logger.info(`Sent message: ${msg.body.substring(0, 50)}...`);
            }
        });
    }

    async start() {
        try {
            logger.info('🔄 Initializing WhatsApp Bot...');
            await this.client.initialize();
        } catch (error) {
            logger.error('Failed to start bot: ' + error.message);
            throw error;
        }
    }

    getClient() {
        return this.client;
    }

    getStatus() {
        return {
            ready: this.isReady,
            stats: logger.getStats(),
        };
    }
}

module.exports = WhatsAppBot;
