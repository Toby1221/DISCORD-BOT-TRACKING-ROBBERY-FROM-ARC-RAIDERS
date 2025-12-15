import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { getDb } from './firebase/admin.js';
import express from 'express';
import cron from 'node-cron';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate important environment variables early and give helpful hints
function checkEnv() {
  const required = [];
  if (!process.env.DISCORD_TOKEN) required.push('DISCORD_TOKEN (bot token)');

  if (required.length) {
    console.error('Missing required environment variables: ' + required.join(', '));
    console.error('Copy .env.example to .env and fill the values. See README.md for details.');
    process.exit(1);
  }

  if (!process.env.GOOGLE_CREDENTIALS && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.warn('Warning: No Firebase credentials found. Set GOOGLE_APPLICATION_CREDENTIALS (path) or GOOGLE_CREDENTIALS (JSON string).');
  }

  if (!process.env.CLIENT_ID || !process.env.PUBLIC_KEY) {
    console.warn('Tip: set CLIENT_ID and PUBLIC_KEY in your .env if you plan to register slash commands or verify interactions.');
  }
}

checkEnv();

const prefix = process.env.PREFIX || '!';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

const commands = new Map();

async function loadCommands() {
  const commandsPath = path.join(__dirname, 'commands');
  if (!fs.existsSync(commandsPath)) return;
  const files = fs.readdirSync(commandsPath).filter((f) => f.endsWith('.js'));
  for (const file of files) {
    const modulePath = `./commands/${file}`;
    try {
      const { default: cmd } = await import(modulePath);
      if (cmd && cmd.name) commands.set(cmd.name, cmd);
    } catch (err) {
      console.error('Failed to load command', file, err);
    }
  }
}

//web server for health checks
const app = express();
const PORT = process.env.PORT || 8080;

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('Bot is awake and operational!');
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Health check server is running on port ${PORT}`);
});

// Scheduled task to keep the bot awake
const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL;

if (RENDER_EXTERNAL_URL) {
  cron.schedule('*/10 * * * *', async () => {
    try {
      console.log('Keep-Alive: Pinging self to prevent spin-down...');
      await axios.get(RENDER_EXTERNAL_URL);
      console.log('Health check ping successful');
    } catch (err) {
      console.error('Health check ping failed', err);
    }
  });
} else {
  console.log('No RENDER_EXTERNAL_URL set, skipping scheduled health checks');
} 

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author?.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/\s+/);
  const cmdName = args.shift().toLowerCase();
  const command = commands.get(cmdName);
  if (!command) return;

  try {
    await command.execute({ message, args, client, db: getDb() });
  } catch (err) {
    console.error('Command execution error', err);
    message.reply('There was an error while executing that command.');
  }
});

(async () => {
  await loadCommands();
  if (!process.env.DISCORD_TOKEN) {
    console.error('Missing DISCORD_TOKEN in environment. See .env.example');
    process.exit(1);
  }
  await client.login(process.env.DISCORD_TOKEN);
})();
