# Discord + Firebase Bot (minimal scaffold)

This repository is a minimal Node.js Discord bot scaffold that uses Firebase Admin (Firestore) as a simple backend.

Quick start

1. Copy `.env.example` to `.env` and set `DISCORD_TOKEN` and one of `GOOGLE_APPLICATION_CREDENTIALS` (path) or `GOOGLE_CREDENTIALS` (JSON string). Also set `FIREBASE_PROJECT_ID` if needed.
2. Install dependencies:

```powershell
npm install
```

3. Run in development (auto-restarts):

```powershell
npm run dev
```

What is included

- `index.js` — main bot file with a simple prefix (`!`) command loader.
- `commands/ping.js` — example command.
- `commands/user.js` — simple Firestore-backed user `get` / `set` example.
- `firebase/admin.js` — initializes Firebase Admin SDK from `GOOGLE_CREDENTIALS` (JSON env) or `GOOGLE_APPLICATION_CREDENTIALS` (file path).

Notes

- This project uses message-based prefix commands (`!`). Make sure `Message Content Intent` is enabled in the Discord Developer Portal for your bot if you want to use message content matching.
- For production, consider using slash commands (recommended) and restrict permissions carefully.
- `CLIENT_ID` and `PUBLIC_KEY` are optional: you only need them if you register slash commands or verify incoming interaction requests. They are not required for simple message-based prefix commands.

Firebase service account

Create a service account in the Firebase console → Project Settings → Service Accounts → Generate new private key. You can either:
- Save the JSON file and set `GOOGLE_APPLICATION_CREDENTIALS` to its path, or
- Copy the JSON content and set `GOOGLE_CREDENTIALS` environment variable to the JSON string.
