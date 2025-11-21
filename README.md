# Discord + Firebase Bot (Minimal Scaffold)

This repository is a minimal Node.js Discord bot scaffold that uses **Firebase Admin (Firestore)** as a simple backend for data persistence. It is pre-configured for a user-specific tracking feature.

## 🚀 Quick Start

1.  **Clone the Repository:**
    ```bash
    git clone [Your Repository URL]
    cd [your-project-folder]
    ```

2.  **Configuration:**
    * Copy `.env.example` to `.env`.
    * Set your **`DISCORD_TOKEN`**.
    * Set your Firebase credentials using either `GOOGLE_APPLICATION_CREDENTIALS` (path to JSON file) or `GOOGLE_CREDENTIALS` (the raw JSON string). Also set `FIREBASE_PROJECT_ID` if needed.

3.  **Install & Run:**
    ```bash
    npm install
    npm run dev  # Runs the bot with auto-restart for development
    ```

---

## 💾 Firestore Data Structure

The bot tracks individual user data tied directly to their Discord ID, stored in the **Firestore** database.

| Element | Path/Field | Value | Description |
| :--- | :--- | :--- | :--- |
| **Collection** | `users` | N/A | Top-level collection for all bot users. |
| **Document** | `{DiscordUserID}` | N/A | Unique document ID based on `message.author.id`. |
| **Field** | `lastRobbed` | ISO-8601 Date String | Timestamp of the last time the user ran the `!robbed` command. |

---

## 📜 Available Commands

The bot uses simple **prefix commands** (default: `!`).

| Command | Description | Example Usage |
| :--- | :--- | :--- |
| `!robbed` | Logs the current date and time as the user's last robbery date. | `!robbed` |
| `!days` | Displays the number of full days elapsed since the user last ran the `!robbed` command. | `!days` |
| `!ping` | A standard test command to check bot responsiveness. | `!ping` |

---

## ⚙️ Project Notes

### Firebase Service Account

To get your Firebase Admin SDK credentials:
1.  Go to the Firebase console → Project Settings → Service Accounts.
2.  Click **Generate new private key** to download a JSON file.
3.  Set the contents of this JSON as the value for the **`GOOGLE_CREDENTIALS`** environment variable (best practice for deployment).

### Discord Intents

This project uses message-based prefix commands (`!`). Make sure the **Message Content Intent** is enabled in the Discord Developer Portal for your bot.

---

## ☁️ Deployment (Going 24/7)

To keep your bot running without your local terminal, you need to deploy it to a persistent cloud host.

1.  **Recommended Hosts:** **Render** (for simplicity) or **Google Cloud Run** (for deep Firebase integration).
2.  **Environment Variables:** On your chosen platform, you **must** set all required secrets (`DISCORD_TOKEN`, `GOOGLE_CREDENTIALS`, etc.) as **environment variables**. **Do not commit your secrets to Git.**
3.  **Keep-Alive (for Free Tiers):** If using Render's free **Web Service**, the service may spin down due to inactivity. You will need to add a simple web endpoint (already done in `index.js` with Express) and use a free external service (like UptimeRobot) to ping the bot's URL every few minutes to keep it active.

---

## 🤝 License

This project is licensed under the **MIT License**.

## 🎉 Contributing

Feel free to fork this project, submit bug reports, or suggest new features via pull requests.