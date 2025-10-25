const config = require('../utils/config');
const logger = require('../utils/logger');
const { chatWithAI, analyzeImageWithAI } = require('../services/gemini');

class MessageHandler {
    constructor(client) {
        this.client = client;
        this.conversationHistory = new Map();
    }

    async handleMessage(msg) {
        try {
            logger.incrementMessage();
            
            const chat = await msg.getChat();
            const contact = await msg.getContact();
            const isGroup = chat.isGroup;
            const body = msg.body.trim();

            logger.info(`Message from ${contact.pushname || contact.number}: ${body.substring(0, 50)}...`);

            if (body.startsWith(config.bot.prefix)) {
                await this.handleCommand(msg, body, chat, contact);
            } else if (msg.hasMedia && body.toLowerCase().includes('analisis')) {
                await this.handleImageAnalysis(msg);
            } else if (body.toLowerCase().startsWith('ai:') || body.toLowerCase().startsWith('tanya:')) {
                await this.handleAIChat(msg, body.substring(body.indexOf(':') + 1).trim());
            }
        } catch (error) {
            logger.error(`Error handling message: ${error.message}`);
        }
    }

    async handleCommand(msg, body, chat, contact) {
        const command = body.split(' ')[0].toLowerCase();
        const args = body.slice(command.length).trim();

        switch (command) {
            case '!help':
            case '!menu':
            case '!info':
                await msg.reply(config.keywords[command]);
                break;

            case '!ai':
                if (args) {
                    await this.handleAIChat(msg, args);
                } else {
                    await msg.reply('❌ Gunakan: !ai [pertanyaan]\nContoh: !ai Apa itu AI?');
                }
                break;

            case '!sticker':
                await this.handleStickerCreation(msg);
                break;

            case '!broadcast':
                await this.handleBroadcast(msg, args, contact);
                break;

            case '!ping':
                await msg.reply('🏓 Pong! Bot aktif dan berjalan.');
                break;

            default:
                // Check if command exists in keywords
                if (config.keywords[command]) {
                    await msg.reply(config.keywords[command]);
                }
        }
    }

    async handleAIChat(msg, question) {
        try {
            const chat = await msg.getChat();
            await chat.sendStateTyping();

            logger.incrementAI();
            
            const chatId = msg.from;
            let history = this.conversationHistory.get(chatId) || [];
            
            if (history.length > 10) {
                history = history.slice(-10);
            }

            const response = await chatWithAI(question, history);
            
            history.push(`User: ${question}`);
            history.push(`AI: ${response}`);
            this.conversationHistory.set(chatId, history);

            await msg.reply(`🤖 *AI Assistant*\n\n${response}`);
        } catch (error) {
            logger.error(`AI chat error: ${error.message}`);
            await msg.reply('❌ Maaf, terjadi kesalahan saat memproses permintaan AI.');
        }
    }

    async handleImageAnalysis(msg) {
        try {
            const chat = await msg.getChat();
            await chat.sendStateTyping();

            if (!msg.hasMedia) {
                await msg.reply('❌ Tidak ada gambar yang terdeteksi.');
                return;
            }

            const media = await msg.downloadMedia();
            
            if (!media.mimetype.startsWith('image/')) {
                await msg.reply('❌ File harus berupa gambar (jpg, png, dll).');
                return;
            }

            logger.info('Analyzing image with AI...');
            const analysis = await analyzeImageWithAI(media.data, media.mimetype);
            
            await msg.reply(`🖼️ *Analisis Gambar*\n\n${analysis}`);
        } catch (error) {
            logger.error(`Image analysis error: ${error.message}`);
            await msg.reply('❌ Gagal menganalisis gambar.');
        }
    }

    async handleStickerCreation(msg) {
        try {
            const quotedMsg = await msg.getQuotedMessage();
            const targetMsg = quotedMsg || msg;

            if (!targetMsg.hasMedia) {
                await msg.reply('❌ Kirim gambar dengan caption !sticker atau reply gambar dengan !sticker');
                return;
            }

            const media = await targetMsg.downloadMedia();
            
            if (!media.mimetype.startsWith('image/')) {
                await msg.reply('❌ File harus berupa gambar.');
                return;
            }

            await this.client.sendMessage(msg.from, media, {
                sendMediaAsSticker: true,
                stickerAuthor: config.bot.name,
                stickerName: 'Bot Sticker',
            });

            logger.info('Sticker created successfully');
        } catch (error) {
            logger.error(`Sticker creation error: ${error.message}`);
            await msg.reply('❌ Gagal membuat stiker. Pastikan file adalah gambar yang valid.');
        }
    }

    async handleBroadcast(msg, message, contact) {
        try {
            if (!config.bot.adminNumbers.includes(contact.id._serialized)) {
                await msg.reply('❌ Maaf, hanya admin yang dapat menggunakan fitur broadcast.');
                return;
            }

            if (!message) {
                await msg.reply('❌ Gunakan: !broadcast [pesan]\nContoh: !broadcast Halo semua!');
                return;
            }

            const chats = await this.client.getChats();
            let successCount = 0;
            let failCount = 0;

            await msg.reply(`📢 Memulai broadcast ke ${chats.length} chat...`);

            for (const chat of chats) {
                try {
                    await chat.sendMessage(`📢 *Pengumuman*\n\n${message}`);
                    successCount++;
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Delay to avoid spam
                } catch (error) {
                    failCount++;
                }
            }

            await msg.reply(`✅ Broadcast selesai!\n\n✔️ Berhasil: ${successCount}\n❌ Gagal: ${failCount}`);
            logger.info(`Broadcast completed: ${successCount} success, ${failCount} failed`);
        } catch (error) {
            logger.error(`Broadcast error: ${error.message}`);
            await msg.reply('❌ Gagal melakukan broadcast.');
        }
    }
}

module.exports = MessageHandler;
