<div align="center">

# 🗄️ ZERO — File Vault

**A premium, minimal file storage & sharing platform.**
Files live in a private Telegram channel — nothing ever touches your disk.

[![Status](https://img.shields.io/badge/status-active-brightgreen?style=for-the-badge)](.)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Telegram](https://img.shields.io/badge/storage-telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://core.telegram.org/bots/api)

[Features](#-features) · [Quick Start](#-quick-start) · [API](#-api-reference) · [Deploy](#-deploying-to-production) · [Troubleshooting](#-troubleshooting)

</div>

---

## 📖 Overview

**ZERO** is a self-hosted, Telegram-backed file vault. Upload once — files stream straight from a private Telegram channel, so your server stays empty. Nested folders, a public gallery, a hidden upload page, and a password-protected admin panel come out of the box.

> **Why ZERO?** No S3 bills. No disk space. No database. Just a bot token and a channel.

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🧰 Tech Stack](#-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔌 API Reference](#-api-reference)
- [📊 Data Model](#-data-model)
- [🎯 Usage Guide](#-usage-guide)
- [🔒 Security](#-security)
- [🌐 Deploying to Production](#-deploying-to-production)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)
- [🙏 Acknowledgements](#-acknowledgements)

---

## ✨ Features

### 🗂️ Storage & Organization
- **Unlimited storage** — files live in a private Telegram channel via the Bot API
- **Zero server load** — nothing is written to disk; files stream from Telegram
- **Nested folders** — up to **5 levels deep**, Google Drive style
- **Move files & folders** — reorganize the entire tree from the admin panel
- **Recursive delete** — deleting a folder wipes everything inside it

### 🎨 User Experience
- **Public gallery** — anyone with the link can browse, preview, and download
- **Live preview** — images, videos, audio, PDFs, and text open in a lightbox
- **Streaming with Range support** — seek video/audio without a full download
- **Fully responsive** — mobile, tablet, and desktop ready
- **Global search** — search across files, folders, uploaders, and paths

### 🔐 Admin & Privacy
- **Hidden upload page** — separate URL, never linked from the public gallery
- **Hidden admin panel** — password protected, accessible only via direct URL
- **Auto-cleanup** — dead entries (removed manually from Telegram) are pruned every 5 minutes

---

## 🏗️ Architecture

```text
┌─────────────────┐
│  User Browser   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  Node.js + Express      │
│  (this server)          │
│  • API routes           │
│  • Metadata only        │
└────────┬────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐  ┌──────────────┐
│files.  │  │ Telegram Bot │
│json    │  │ API          │
│(meta)  │  └──────┬───────┘
└────────┘         │
                   ▼
           ┌───────────────┐
           │ Private       │
           │ Telegram      │
           │ Channel       │
           │ (actual files)│
           └───────────────┘
```

**Key point:** File bytes flow **browser → your server → Telegram**. Nothing is written to disk. Only metadata (file ID, name, size, folder) lives in `files.json`.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Server | Express |
| Uploads | Multer |
| HTTP client | Axios |
| Storage | Telegram Bot API |
| Metadata | `files.json` |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18.x** or higher
- A **Telegram account**
- A **private Telegram channel**

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/zero.git
cd zero
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create the Telegram bot

1. Open Telegram → message [@BotFather](https://t.me/BotFather)
2. Send `/newbot`
3. Pick a name and username
4. Copy the **bot token** (looks like `1234567890:AAH...`)

### 4️⃣ Create a private Telegram channel

1. Create a new **private** channel
2. Open **Channel Settings → Administrators → Add Admin**
3. Add your bot as an administrator
4. Grant these permissions:
   - ✅ **Post Messages**
   - ✅ **Delete Messages**

### 5️⃣ Get the channel ID

Post any message in your channel, then open:

```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```

Find `"chat":{"id":-100...}` — that's your **channel ID**.

### 6️⃣ Configure environment

Create a `.env` file in the project root:

```env
BOT_TOKEN=1234567890:AAH_your_bot_token_here
CHANNEL_ID=-1001234567890
ADMIN_PASS=change_this_to_a_strong_password
PORT=3000
```

| Variable | Description |
|---|---|
| `BOT_TOKEN` | Token from BotFather |
| `CHANNEL_ID` | Private channel ID (starts with `-100`) |
| `ADMIN_PASS` | Password for the admin panel |
| `PORT` | Server port (default: `3000`) |

### 7️⃣ Start the server

```bash
npm start
```

Expected output:

```text
===========================================
✅ Server running on port 3000
📡 Channel ID: -1001234567890
🔐 Admin password: SET ✓
🤖 Bot token: SET ✓
📂 Loaded 0 file entries
===========================================
```

### 8️⃣ Open in browser

| Page | URL | Access |
|---|---|---|
| 🖼️ Public gallery | `http://localhost:3000/` | Everyone |
| ⬆️ Upload page | `http://localhost:3000/upload` | Anyone with the link |
| 🔐 Admin panel | `http://localhost:3000/admin` | Password required |

---

## 📁 Project Structure

```text
zero/
├── server.js              # Express server + all API routes
├── package.json           # Dependencies & scripts
├── package-lock.json      # Locked dependency versions
├── files.json             # Metadata store (auto-created)
├── .env                   # Secrets — never commit this
├── .gitignore
└── public/
    ├── index.html         # Public gallery
    ├── upload.html        # Upload page
    ├── admin.html         # Admin panel
    ├── style.css          # Shared styles
    ├── app.js             # Shared frontend logic
    └── images/
        └── logo.png       # Site logo
```

---

## 🔌 API Reference

### 🌐 Public endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/browse?folder=<id>` | List a folder's contents (root if no ID) |
| `GET` | `/api/search?q=<query>` | Search files & folders |
| `GET` | `/stream/:id` | Stream a file (Range supported) |

### ⬆️ Upload endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/upload` | Upload a file (`multipart/form-data`) |
| `POST` | `/api/folders` | Create a new folder |

<details>
<summary><b>Upload body fields</b></summary>

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | ✅ | File to upload (max **50 MB**) |
| `title` | String | ❌ | Display title |
| `uploader` | String | ❌ | Uploader name (default: `Anonymous`) |
| `parentId` | String | ❌ | Target folder ID (default: root) |

</details>

<details>
<summary><b>Create folder body</b></summary>

```json
{
  "name": "My Folder",
  "parentId": null,
  "uploader": "Your Name"
}
```

</details>

### 🔐 Admin endpoints

> All admin endpoints require `adminPass` in the request body.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/verify-admin` | Verify admin password |
| `GET` | `/api/all` | Flat list of all files & folders |
| `POST` | `/api/delete/:id` | Delete a file |
| `POST` | `/api/delete-folder/:id` | Delete a folder recursively |
| `POST` | `/api/move-file/:id` | Move file to another folder |
| `POST` | `/api/move-folder/:id` | Move folder to another folder |
| `POST` | `/api/cleanup` | Remove dead entries (missing from Telegram) |

---

## 📊 Data Model

`files.json` has two top-level keys: `files` and `folders`.

```json
{
  "files": {
    "abc123": {
      "id": "abc123",
      "parentId": null,
      "fileId": "BQACAgUAAxkBAAIC...",
      "messageId": 1234,
      "name": "sunset.jpg",
      "title": "Sunset over ocean",
      "size": 2456789,
      "mime": "image/jpeg",
      "uploader": "Sangam",
      "time": 1726400000000,
      "type": "file"
    }
  },
  "folders": {
    "f1a2b3": {
      "id": "f1a2b3",
      "parentId": null,
      "name": "Photos",
      "createdBy": "Sangam",
      "time": 1726400000000,
      "type": "folder"
    }
  }
}
```

| Field | Meaning |
|---|---|
| `parentId: null` | Item is at the **root** |
| `parentId: "f1a2b3"` | Item lives inside that folder |
| Depth limit | **5 levels** |

---

## 🎯 Usage Guide

### ⬆️ Uploading files

1. Open `/upload`
2. *(Optional)* Navigate to a folder via the breadcrumb
3. Click **"+ New folder here"** to create a nested folder
4. Drop a file or click the drop zone
5. Add a title and your name
6. Click **Upload**

> The page remembers your last folder — upload multiple files to the same place without re-navigating.

### 🖼️ Browsing files

1. Open `/` (public gallery)
2. Click a folder to enter it
3. Use the breadcrumb to go back up
4. Click a file to preview (image / video / PDF / text)
5. Click the download icon to save

### 🔐 Admin panel

1. Open `/admin` *(bookmark it — it's not linked anywhere)*
2. Enter your admin password
3. Browse folders like the public page
4. Use **📦 Move** to relocate files or folders
5. Use **🗑 Delete** to remove items *(folders delete recursively)*
6. Use the search bar to find anything across the tree

---

## 🔒 Security

### ✅ Best practices

- **Never commit `.env`** — it holds your bot token and admin password
- **Use a strong admin password** — 12+ chars, mixed case, numbers, symbols
- **Keep your Telegram channel private** — only you + the bot
- **Bookmark the admin URL privately** — don't share it
- **Back up `files.json` regularly** — it's your entire database

### 🧹 Manual Telegram deletions

If you delete a file from Telegram manually, the site keeps its metadata but the file won't load. Auto-cleanup detects this and removes the entry — it runs **every 5 minutes**.

To clean up immediately:

```bash
curl -X POST http://localhost:3000/api/cleanup \
  -H "Content-Type: application/json" \
  -d '{"adminPass":"your_password"}'
```

### 🚫 Recommended `.gitignore`

```gitignore
node_modules/
.env
files.json.backup
*.backup
```

> ⚠️ **Do NOT ignore `files.json`** — it's your database. Commit it so you always have a backup.

---

## 🌐 Deploying to Production

<details>
<summary><b>Option 1 — GitHub Codespaces</b> (dev / testing)</summary>

Works out of the box. Keep in mind:

- Free tier = **60 hours/month** per account
- Server stops when the Codespace sleeps
- Make port `3000` **public** in the **PORTS** tab

</details>

<details>
<summary><b>Option 2 — Any VPS</b> (recommended for production)</summary>

Works on any Linux VPS with Node.js:

```bash
git clone <your-repo> && cd zero
npm install
# create .env
npm start
```

Keep it alive with **PM2**:

```bash
npm install -g pm2
pm2 start server.js --name zero
pm2 save
pm2 startup
```

Put **Nginx** in front for HTTPS:

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        client_max_body_size 50M;
    }
}
```

</details>

<details>
<summary><b>Option 3 — Render / Railway / Fly.io</b></summary>

All three support Node.js apps with minimal config:

- **Build command:** `npm install`
- **Start command:** `npm start`
- **Environment variables:** copy from `.env`
- **Persistent storage:** attach a volume mounted at `/app` so `files.json` survives restarts

</details>

---

## 🛠️ Troubleshooting

<details>
<summary><b>"chat not found" error on upload</b></summary>

- Check `CHANNEL_ID` starts with a single `-` (not `--`)
- Verify the bot is an **admin** of the channel (not just a member)
- Verify the bot has **Post Messages** permission

</details>

<details>
<summary><b>Admin password doesn't work</b></summary>

- Confirm `ADMIN_PASS` is set in `.env` — no quotes, no spaces around `=`
- Restart the server after editing `.env`
- Check the terminal — banner shows `Admin password: SET ✓` or `NOT SET ❌`
- Clear browser session storage: **F12 → Application → Session Storage → clear**

</details>

<details>
<summary><b>Files not showing after upload</b></summary>

- Check the browser console (**F12**) for errors
- Check the server terminal for `Upload error:`
- Verify the Telegram channel actually received the message

</details>

<details>
<summary><b>Upload fails on large files</b></summary>

The Telegram Bot API has a **50 MB limit** per file. For larger files, run a [Local Bot API Server](https://core.telegram.org/bots/api#using-a-local-bot-api-server).

</details>

<details>
<summary><b>"message to delete not found" in admin</b></summary>

The message was already removed from Telegram. The delete endpoint still removes it from `files.json` — you can safely ignore the warning.

</details>

---

## 🗺️ Roadmap

- [ ] Multiple file upload in one go
- [ ] Drag-and-drop folder upload
- [ ] File rename from admin
- [ ] Shareable per-folder links
- [ ] Download counter per file
- [ ] Dark / light theme toggle
- [ ] Bulk select + move / delete in admin
- [ ] Thumbnail generation for videos

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

**MIT © 2026** — free to use, modify, and distribute. See [`LICENSE`](LICENSE) for details.

---

## 🙏 Acknowledgements

Built with:

- [Node.js](https://nodejs.org/) — runtime
- [Express](https://expressjs.com/) — web framework
- [Multer](https://github.com/expressjs/multer) — uploads
- [Axios](https://axios-http.com/) — HTTP client
- [Telegram Bot API](https://core.telegram.org/bots/api) — storage backend
- [Inter font](https://rsms.me/inter/) — typography

---

<div align="center">

**Made with ❤️ for anyone who needs simple, private file storage.**

⭐ If ZERO saved you money on cloud storage, star the repo!

</div>
