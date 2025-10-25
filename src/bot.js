require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const logger = require('./utils/logger');
const config = require('./utils/config');
const MessageHandler = require('./handlers/messageHandler');
const GroupHandler = require('./handlers/groupHandler');

class WhatsAppBot {
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth({
                dataPath: '.wwebjs_auth'
            }),
            puppeteer: {
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
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
            if (this.isReady && config.features.groupManagement) {
                await this.groupHandler.handleGroupJoin(notification);
            }
        });

        this.client.on('group_leave', async (notification) => {
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
