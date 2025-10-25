const fs = require('fs-extra');
const path = require('path');
const logger = require('./logger');

const CONFIG_FILE = path.join(__dirname, 'config.json');
const DEFAULT_CONFIG_PATH = path.join(__dirname, 'config.js');

class ConfigManager {
    constructor() {
        this.config = null;
        this.loadConfig();
    }

    loadConfig() {
        try {
            if (fs.existsSync(CONFIG_FILE)) {
                const data = fs.readFileSync(CONFIG_FILE, 'utf8');
                this.config = JSON.parse(data);
                logger.info('Config loaded from config.json');
            } else {
                this.config = require('./config');
                logger.info('Config loaded from default config.js');
            }
        } catch (error) {
            logger.error('Error loading config: ' + error.message);
            this.config = require('./config');
        }
        return this.config;
    }

    getConfig() {
        if (!this.config) {
            this.loadConfig();
        }
        return this.config;
    }

    saveConfig(newConfig) {
        try {
            fs.writeFileSync(CONFIG_FILE, JSON.stringify(newConfig, null, 2));
            this.config = newConfig;
            logger.info('Config saved successfully');
            return { success: true, message: 'Configuration saved successfully' };
        } catch (error) {
            logger.error('Error saving config: ' + error.message);
            return { success: false, message: 'Failed to save configuration: ' + error.message };
        }
    }

    updateConfig(updates) {
        try {
            const currentConfig = this.getConfig();
            const newConfig = this.mergeDeep(currentConfig, updates);
            return this.saveConfig(newConfig);
        } catch (error) {
            logger.error('Error updating config: ' + error.message);
            return { success: false, message: 'Failed to update configuration: ' + error.message };
        }
    }

    mergeDeep(target, source) {
        const output = Object.assign({}, target);
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source[key] });
                    } else {
                        output[key] = this.mergeDeep(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    }

    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    resetToDefault() {
        try {
            if (fs.existsSync(CONFIG_FILE)) {
                fs.unlinkSync(CONFIG_FILE);
            }
            this.config = require('./config');
            logger.info('Config reset to default');
            return { success: true, message: 'Configuration reset to default' };
        } catch (error) {
            logger.error('Error resetting config: ' + error.message);
            return { success: false, message: 'Failed to reset configuration: ' + error.message };
        }
    }
}

module.exports = new ConfigManager();
