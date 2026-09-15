# ZERO — File Vault

A premium, minimal file storage and sharing platform. Files are stored in a private Telegram channel — nothing touches your own server. Comes with nested folders (up to 5 levels), public gallery, hidden upload page, and admin panel.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.x-339933?logo=node.js&logoColor=white)

---

## ✨ Features

- **Unlimited storage** — files are stored directly in a private Telegram channel via Bot API
- **Zero server load** — nothing is saved on your server; files stream from Telegram
- **Nested folders** — up to 5 levels deep, Google Drive style
- **Public gallery** — anyone with the link can browse, view, and download
- **Hidden upload page** — separate URL for uploads, not linked from public page
- **Hidden admin panel** — password protected, only accessible via direct URL
- **Move files & folders** — admin can reorganize the entire tree
- **Recursive delete** — deleting a folder removes everything inside it
- **Global search** — search across files, folders, uploaders, and paths
- **Live preview** — images, videos, audio, PDFs, and text files open in a lightbox
- **Streaming with Range support** — video/audio can be seeked without full download
- **Fully responsive** — works on mobile, tablet, and desktop
- **Auto-cleanup** — dead entries (manually deleted from Telegram) are removed automatically

---

## 🏗️ Architecture

```
┌─────────────────┐
│  User Browser   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  Node.js + Express      │
│  (this server)          │
│  - API routes           │
│  - Metadata only        │
└────────┬────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐  ┌──────────────┐
│files.  │  │ Telegram Bot │
│json    │  │ API          │
│(metadata)│ └──────┬───────┘
└────────┘         │
                   ▼
           ┌───────────────┐
           │ Private       │
           │ Telegram      │
           │ Channel       │
           │ (actual files)│
           └───────────────┘
```

**Key point:** The actual file bytes go from the browser → your server → Telegram. Nothing is written to disk. Only metadata (file ID, name, size, folder) is stored in `files.json`.

---

## 🚀 Quick Start

### Prerequisites

- Node.js **18.x** or higher
- A Telegram account
- A private Telegram channel

### 1. Clone the repository

```bash
git clone https://github.com/your-username/zero.git
cd zero
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the Telegram bot

1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Send `/newbot`
3. Choose a name and username for your bot
4. Copy the **bot token** (looks like `1234567890:AAH...`)

### 4. Create a private Telegram channel

1. Create a new **private** channel on Telegram
2. Open **Channel Settings → Administrators → Add Admin**
3. Add your bot as an administrator
4. Grant these permissions:
   - ✅ Post Messages
   - ✅ Delete Messages

### 5. Get the channel ID

Send any message in your channel, then open this URL in your browser:

```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```

Look for `"chat":{"id":-100...}` — that's your channel ID (starts with `-100`).

### 6. Configure environment

Create a `.env` file in the project root:

```env
BOT_TOKEN=1234567890:AAH_your_bot_token_here
CHANNEL_ID=-1001234567890
ADMIN_PASS=change_this_to_a_strong_password
PORT=3000
```

| Variable | Description |
|----------|-------------|
| `BOT_TOKEN` | Token from BotFather |
| `CHANNEL_ID` | Your private channel ID (starts with `-100`) |
| `ADMIN_PASS` | Password for the admin panel |
| `PORT` | Server port (default: 3000) |

### 7. Start the server

```bash
npm start
```

You should see:

```
===========================================
✅ Server running on port 3000
📡 Channel ID: -1001234567890
🔐 Admin password: SET ✓
🤖 Bot token: SET ✓
📂 Loaded 0 file entries
===========================================
```

### 8. Open in browser

| Page | URL | Access |
|------|-----|--------|
| Public gallery | `http://localhost:3000/` | Everyone |
| Upload page | `http://localhost:3000/upload` | Anyone with the link |
| Admin panel | `http://localhost:3000/admin` | Password required |

---

## 📁 Project Structure

```
zero/
├── server.js              # Express server + all API routes
├── package.json           # Dependencies & scripts
├── package-lock.json      # Locked dependency versions
├── files.json             # Metadata store (auto-created)
├── .env                   # Secrets (never commit this)
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

### Public endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/browse?folder=<id>` | List contents of a folder (or root if no ID) |
| `GET` | `/api/search?q=<query>` | Search across all files & folders |
| `GET` | `/stream/:id` | Stream a file (proxied from Telegram, Range supported) |

### Upload endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload` | Upload a file (`multipart/form-data`) |
| `POST` | `/api/folders` | Create a new folder |

**Upload body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | ✅ | The file to upload (max 50 MB) |
| `title` | String | ❌ | Display title |
| `uploader` | String | ❌ | Uploader name (default: "Anonymous") |
| `parentId` | String | ❌ | Target folder ID (default: root) |

**Create folder body:**

```json
{
  "name": "My Folder",
  "parentId": null,
  "uploader": "Your Name"
}
```

### Admin endpoints

All admin endpoints require `adminPass` in the request body.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/verify-admin` | Verify admin password |
| `GET` | `/api/all` | Flat list of all files & folders |
| `POST` | `/api/delete/:id` | Delete a file |
| `POST` | `/api/delete-folder/:id` | Delete a folder recursively |
| `POST` | `/api/move-file/:id` | Move file to another folder |
| `POST` | `/api/move-folder/:id` | Move folder to another folder |
| `POST` | `/api/cleanup` | Remove dead entries (missing from Telegram) |

---

## 📊 Data Model

`files.json` has two top-level keys:

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

- `parentId: null` → item is at root
- `parentId: "f1a2b3"` → item lives inside that folder
- Depth limit: **5 levels**

---

## 🎯 Usage Guide

### Uploading files

1. Open `/upload`
2. (Optional) Navigate to a folder using the breadcrumb
3. Click **"+ New folder here"** to create a nested folder
4. Drop a file or click the drop zone
5. Add a title and your name
6. Click **Upload**

The page remembers your last folder — so you can upload multiple files to the same location without re-navigating.

### Browsing files

1. Open `/` (public gallery)
2. Click any folder to enter it
3. Use the breadcrumb to go back up
4. Click a file to preview (image/video/PDF/text)
5. Click the download icon to save

### Admin panel

1. Open `/admin` (bookmark this — it's not linked anywhere)
2. Enter your admin password
3. Browse folders like the public page
4. Use the **📦 Move** button to relocate files or folders
5. Use the **🗑 Delete** button to remove items (folders delete recursively)
6. Use the search bar to find anything across the entire tree

---

## 🔒 Security

### Best practices

- **Never commit `.env`** — it contains your bot token and admin password
- **Use a strong admin password** — at least 12 characters, mixed case, numbers, symbols
- **Keep your Telegram channel private** — only you + the bot should have access
- **Bookmark the admin URL privately** — don't share it
- **Back up `files.json` regularly** — it contains all your file metadata

### What happens if you delete a file from Telegram manually?

The website will still have its metadata (name, size, path), but the file won't load. The next time someone loads the gallery, the auto-cleanup will detect the missing file and remove its entry (checks every 5 minutes).

To clean up immediately, call:

```bash
curl -X POST http://localhost:3000/api/cleanup \
  -H "Content-Type: application/json" \
  -d '{"adminPass":"your_password"}'
```

### Recommended `.gitignore`

```
node_modules/
.env
files.json.backup
*.backup
```

⚠️ **Do NOT ignore `files.json`** — it's your database. Commit it to git so you have a backup.

---

## 🌐 Deploying to Production

### Option 1: GitHub Codespaces (dev / testing)

Already works out of the box. Remember:
- Free tier = 60 hours/month per account
- Server stops when the Codespace sleeps
- Make port 3000 **public** in the **PORTS** tab

### Option 2: Any VPS (recommended for production)

Works on any Linux VPS with Node.js:

```bash
git clone <your-repo> && cd zero
npm install
# create .env
npm start
```

Use **PM2** to keep it running:

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

### Option 3: Render / Railway / Fly.io

All three support Node.js apps with minimal config:

- **Build command:** `npm install`
- **Start command:** `npm start`
- **Environment variables:** copy from `.env`
- **Persistent storage:** attach a volume and mount at `/app` so `files.json` survives restarts

---

## 🛠️ Troubleshooting

### "chat not found" error on upload

- Check that `CHANNEL_ID` starts with a single `-` (not `--`)
- Verify the bot is an **admin** of the channel (not just a member)
- Verify the bot has **Post Messages** permission

### Admin password doesn't work

- Confirm `ADMIN_PASS` is set in `.env` (no quotes, no spaces around `=`)
- Restart the server after changing `.env`
- Check the terminal — the startup banner shows `Admin password: SET ✓` or `NOT SET ❌`
- Clear browser session storage: **F12 → Application → Session Storage → clear**

### Files not showing after upload

- Check the browser console (**F12**) for errors
- Check the server terminal for `Upload error:`
- Verify the Telegram channel has the message

### Upload fails on large files

Telegram Bot API has a **50 MB limit** per file. To upload larger files you'd need a [Local Bot API Server](https://core.telegram.org/bots/api#using-a-local-bot-api-server).

### "message to delete not found" in admin

The message was already removed from Telegram. The delete endpoint still removes it from `files.json` — you can safely ignore the warning.

---

## 🗺️ Roadmap

- [ ] Multiple file upload in one go
- [ ] Drag-and-drop folder upload
- [ ] File rename from admin
- [ ] Shareable per-folder links
- [ ] Download counter per file
- [ ] Dark/light theme toggle
- [ ] Bulk select + move/delete in admin
- [ ] Thumbnail generation for videos

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📜 License

MIT © 2026 — free to use, modify, and distribute.

---

## 🙏 Acknowledgements

Built with:

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Multer](https://github.com/expressjs/multer)
- [Axios](https://axios-http.com/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Inter font](https://rsms.me/inter/)

---

**Made with ❤️ for anyone who needs simple, private file storage.**#   z e r o - p u b l i c  
 