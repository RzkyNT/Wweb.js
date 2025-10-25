# WhatsApp Bot Project

## Overview
Bot WhatsApp multifungsi yang terintegrasi dengan Gemini AI, mendukung auto-reply, manajemen grup, pengiriman media, dan broadcast. Dashboard web tersedia untuk monitoring aktivitas bot secara real-time.

## Recent Changes
- **2025-10-25**: Initial project setup
  - Implemented WhatsApp bot using whatsapp-web.js
  - Integrated Gemini AI for intelligent chat responses
  - Added auto-reply with keyword recognition
  - Implemented group management (welcome/leave messages)
  - Added media support and sticker creation
  - Built broadcast feature for announcements
  - Created web dashboard for monitoring

## Project Architecture

### Backend Structure
```
src/
├── bot.js              - Main WhatsApp bot client
├── dashboard.js        - Express server for web dashboard
├── handlers/
│   ├── messageHandler.js  - Message processing & commands
│   └── groupHandler.js    - Group event handling
├── services/
│   └── gemini.js       - Gemini AI integration
└── utils/
    ├── config.js       - Bot configuration
    └── logger.js       - Logging system
```

### Frontend
- HTML/CSS/JavaScript dashboard
- Real-time status monitoring
- Auto-refresh every 5 seconds

### Key Features
1. **AI Chat**: Gemini AI powered conversations
2. **Auto Reply**: Keyword-based automatic responses
3. **Group Management**: Welcome messages, auto-moderation
4. **Media Support**: Image/document sending and sticker creation
5. **Broadcast**: Mass messaging to contacts/groups
6. **Dashboard**: Web interface for monitoring (port 5000)

### Dependencies
- whatsapp-web.js: WhatsApp Web API client
- @google/genai: Gemini AI SDK
- express: Web server for dashboard
- qrcode-terminal: QR code display
- fs-extra: File system utilities
- dotenv: Environment variable management

### Environment Variables
- `GEMINI_API_KEY`: Google Gemini API key (configured)
- `SESSION_SECRET`: Session encryption key
- `DASHBOARD_ENABLED`: Enable/disable dashboard

## Commands
- `!help` - Show help menu
- `!menu` - Main menu
- `!ai [message]` - Chat with AI
- `!sticker` - Create sticker from image
- `!broadcast [msg]` - Send announcement (admin only)
- `!info` - Bot information
- `!ping` - Check bot status
- `ai: [question]` - Alternative AI command

## User Preferences
- Language: Indonesian
- Full-featured WhatsApp bot with AI integration
- Dashboard monitoring required

## Tech Stack
- Runtime: Node.js
- Framework: Express.js
- AI: Google Gemini
- WhatsApp: whatsapp-web.js
