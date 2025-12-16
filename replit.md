# Discord + Firebase Bot

A Node.js Discord bot using Firebase (Firestore) as a backend for data persistence.

## Overview
This bot tracks user-specific data tied to their Discord ID. It uses prefix commands (default: `!`) and stores data in Firestore.

## Project Structure
```
├── commands/          # Bot commands
│   ├── days.js       # Shows days since last robbed
│   ├── ping.js       # Health check command
│   └── robbed.js     # Logs robbery timestamp
├── firebase/
│   └── admin.js      # Firebase Admin SDK initialization
├── index.js          # Main entry point (Discord client + Express health server)
├── package.json      # Dependencies and scripts
└── .env.example      # Environment variable template
```

## Required Environment Variables
- `DISCORD_TOKEN` - Your Discord bot token (required)
- `GOOGLE_CREDENTIALS_B64` or `GOOGLE_CREDENTIALS` - Firebase service account credentials
- `FIREBASE_PROJECT_ID` - Firebase project ID (optional, extracted from credentials)

## Available Commands
| Command | Description |
|---------|-------------|
| `!robbed` | Logs current date/time as last robbery date |
| `!days` | Shows days since last `!robbed` command |
| `!ping` | Test command to check bot responsiveness |

## Running the Bot
The Express health check server runs on port 5000 for Replit compatibility.

## Deployment Notes
- The bot needs the **Message Content Intent** enabled in Discord Developer Portal
- Firebase credentials should be set as environment variables (never committed to Git)
