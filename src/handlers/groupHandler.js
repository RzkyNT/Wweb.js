const config = require('../utils/config');
const logger = require('../utils/logger');

class GroupHandler {
    constructor(client) {
        this.client = client;
    }

    async handleGroupJoin(notification) {
        try {
            const chat = await notification.getChat();
            
            if (!chat.isGroup) return;

            const contact = await notification.getContact();
            
            const welcomeMsg = config.welcomeMessage.replace('{name}', `@${contact.id.user}`);
            
            await chat.sendMessage(welcomeMsg, {
                mentions: [contact],
            });

            logger.info(`Welcome message sent to ${contact.pushname || contact.number} in group ${chat.name}`);
        } catch (error) {
            logger.error(`Error handling group join: ${error.message}`);
        }
    }

    async handleGroupLeave(notification) {
        try {
            const chat = await notification.getChat();
            
            if (!chat.isGroup) return;

            const contact = await notification.getContact();
            
            await chat.sendMessage(`👋 ${contact.pushname || contact.number} telah meninggalkan grup. Semoga sukses selalu!`);

            logger.info(`Leave message sent for ${contact.pushname || contact.number} in group ${chat.name}`);
        } catch (error) {
            logger.error(`Error handling group leave: ${error.message}`);
        }
    }

    async getGroupInfo(chat) {
        if (!chat.isGroup) return null;

        const participants = chat.participants;
        const admins = participants.filter(p => p.isAdmin).length;
        
        return {
            name: chat.name,
            description: chat.description || 'Tidak ada deskripsi',
            participantCount: participants.length,
            adminCount: admins,
        };
    }
}

module.exports = GroupHandler;
