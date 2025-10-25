const fs = require('fs-extra');
const path = require('path');

class Logger {
    constructor() {
        this.logDir = path.join(__dirname, '../../logs');
        this.ensureLogDir();
        this.stats = {
            totalMessages: 0,
            aiRequests: 0,
            errors: 0,
            startTime: new Date(),
        };
    }

    ensureLogDir() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    log(message, type = 'INFO') {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${type}] ${message}`;
        console.log(logMessage);
        
        const logFile = path.join(this.logDir, `bot-${new Date().toISOString().split('T')[0]}.log`);
        fs.appendFileSync(logFile, logMessage + '\n');
    }

    info(message) {
        this.log(message, 'INFO');
    }

    error(message) {
        this.stats.errors++;
        this.log(message, 'ERROR');
    }

    incrementMessage() {
        this.stats.totalMessages++;
    }

    incrementAI() {
        this.stats.aiRequests++;
    }

    getStats() {
        return {
            ...this.stats,
            uptime: Math.floor((new Date() - this.stats.startTime) / 1000),
        };
    }
}

module.exports = new Logger();
