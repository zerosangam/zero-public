require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const ADMIN_PASS = process.env.ADMIN_PASS;
const MAX_DEPTH = 5;

if (!BOT_TOKEN || !CHANNEL_ID || !ADMIN_PASS) {
  console.error('❌ Missing env vars. Check .env');
  process.exit(1);
}

// ===== Data store =====
const DATA_FILE = path.join(__dirname, 'files.json');
let store = { files: {}, folders: {} };

function loadStore() {
  if (!fs.existsSync(DATA_FILE)) return;
  try {
    const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    // Old format: flat object { id: fileData }
    if (raw.files === undefined && raw.folders === undefined) {
      Object.values(raw).forEach(f => { if (f.parentId === undefined) f.parentId = null; });
      store.files = raw;
      store.folders = {};
      console.log('🔄 Migrated old files.json → new format (no data lost)');
    } else {
      store.files = raw.files || {};
      store.folders = raw.folders || {};
    }
    // Ensure parentId on all files
    let migrated = 0;
    Object.values(store.files).forEach(f => {
      if (f.parentId === undefined) { f.parentId = null; migrated++; }
    });
    Object.values(store.folders).forEach(f => {
      if (f.parentId === undefined) f.parentId = null;
    });
    if (migrated > 0) {
      console.log(`✅ Migrated ${migrated} files → root folder`);
      saveStore();
    }
  } catch (e) {
    console.error('⚠️ files.json corrupted, starting fresh:', e.message);
    store = { files: {}, folders: {} };
  }
}

function saveStore() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
  } catch (e) {
    console.error('⚠️ Save failed:', e.message);
  }
}

loadStore();

// ===== Folder helpers =====
function getDepth(folderId) {
  if (!folderId) return 0;
  let depth = 0;
  let cur = folderId;
  while (cur && depth < 20) {
    const f = store.folders[cur];
    if (!f) break;
    depth++;
    cur = f.parentId;
  }
  return depth;
}

function getPath(folderId) {
  const parts = [];
  let cur = folderId;
  while (cur && parts.length < 20) {
    const f = store.folders[cur];
    if (!f) break;
    parts.unshift({ id: f.id, name: f.name });
    cur = f.parentId;
  }
  return parts;
}

function isDescendant(candidateId, ancestorId) {
  let cur = candidateId;
  while (cur) {
    if (cur === ancestorId) return true;
    const f = store.folders[cur];
    if (!f) break;
    cur = f.parentId;
  }
  return false;
}

// ===== Upload =====
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }
});

app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

// ============================================================
//  ROUTES
// ============================================================

// -------- Browse a folder --------
app.get('/api/browse', (req, res) => {
  const folderId = req.query.folder || null;
  if (folderId && !store.folders[folderId]) {
    return res.status(404).json({ error: 'Folder not found' });
  }

  const folders = Object.values(store.folders)
    .filter(f => f.parentId === folderId)
    .sort((a, b) => a.name.localeCompare(b.name));

  const files = Object.values(store.files)
    .filter(f => f.parentId === folderId)
    .sort((a, b) => b.time - a.time);

  const current = folderId ? store.folders[folderId] : null;
  const path = getPath(folderId);
  const depth = folderId ? getDepth(folderId) : 0;

  res.json({
    current,
    path,
    depth,
    canCreateFolder: depth < MAX_DEPTH,
    folders,
    files
  });
});

// -------- Create folder --------
app.post('/api/folders', (req, res) => {
  const { name, parentId, uploader } = req.body || {};
  const cleanName = String(name || '').trim().slice(0, 60);
  if (!cleanName) return res.status(400).json({ error: 'Folder name required' });

  const parent = parentId || null;
  if (parent && !store.folders[parent]) {
    return res.status(404).json({ error: 'Parent folder not found' });
  }
  const parentDepth = parent ? getDepth(parent) : 0;
  if (parentDepth >= MAX_DEPTH) {
    return res.status(400).json({ error: `Max ${MAX_DEPTH} levels reached` });
  }

  // Duplicate name in same parent?
  const dup = Object.values(store.folders).find(
    f => f.parentId === parent && f.name.toLowerCase() === cleanName.toLowerCase()
  );
  if (dup) return res.status(400).json({ error: 'Folder name already exists here' });

  const id = crypto.randomBytes(4).toString('hex');
  const folder = {
    id,
    parentId: parent,
    name: cleanName,
    createdBy: (uploader || 'Anonymous').slice(0, 40),
    time: Date.now(),
    type: 'folder'
  };
  store.folders[id] = folder;
  saveStore();
  res.json({ success: true, folder });
});

// -------- Upload file (accepts parentId) --------
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file received' });

    const uploader = (req.body.uploader || 'Anonymous').slice(0, 40);
    const title = (req.body.title || '').trim().slice(0, 80);
    const parentId = req.body.parentId || null;

    if (parentId && !store.folders[parentId]) {
      return res.status(404).json({ error: 'Target folder not found' });
    }

    const file = req.file;
    const form = new FormData();
    form.append('chat_id', CHANNEL_ID);
    form.append('document', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype
    });
    form.append('caption',
      `Title: ${title || file.originalname}\n` +
      `Uploader: ${uploader}\n` +
      `Path: /${getPath(parentId).map(p => p.name).join('/')}\n` +
      `File: ${file.originalname}\n` +
      `Date: ${new Date().toISOString()}`
    );

    const tgRes = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
      form,
      {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 120000
      }
    );

    if (!tgRes.data.ok) throw new Error(tgRes.data.description || 'Upload failed');

    const doc = tgRes.data.result.document;
    const shortId = crypto.randomBytes(6).toString('hex');

    store.files[shortId] = {
      id: shortId,
      parentId,
      fileId: doc.file_id,
      messageId: tgRes.data.result.message_id,
      name: file.originalname,
      title: title || file.originalname,
      size: doc.file_size || file.size,
      mime: file.mimetype,
      uploader,
      time: Date.now(),
      type: 'file'
    };
    saveStore();

    res.json({ success: true, id: shortId });
  } catch (err) {
    console.error('Upload error:', err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data?.description || err.message || 'Upload failed'
    });
  }
});

// -------- Search across everything --------
app.get('/api/search', (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  if (!q) return res.json({ folders: [], files: [] });

  const folders = Object.values(store.folders)
    .filter(f => f.name.toLowerCase().includes(q))
    .map(f => ({ ...f, path: getPath(f.id).map(p => p.name).join(' / ') }))
    .slice(0, 100);

  const files = Object.values(store.files)
    .filter(f =>
      (f.name || '').toLowerCase().includes(q) ||
      (f.title || '').toLowerCase().includes(q) ||
      (f.uploader || '').toLowerCase().includes(q)
    )
    .map(f => ({ ...f, path: getPath(f.parentId).map(p => p.name).join(' / ') }))
    .sort((a, b) => b.time - a.time)
    .slice(0, 200);

  res.json({ folders, files });
});

// -------- Stream file from Telegram --------
app.get('/stream/:id', async (req, res) => {
  const meta = store.files[req.params.id];
  if (!meta) return res.status(404).send('Not found');

  try {
    const fileRes = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${meta.fileId}`,
      { timeout: 15000 }
    );
    if (!fileRes.data.ok) throw new Error('getFile failed');

    const filePath = fileRes.data.result.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    const headers = {};
    if (req.headers.range) headers.Range = req.headers.range;

    const streamRes = await axios.get(fileUrl, {
      responseType: 'stream',
      headers,
      timeout: 30000
    });

    res.setHeader('Content-Type', meta.mime || 'application/octet-stream');
    if (streamRes.headers['content-length'])
      res.setHeader('Content-Length', streamRes.headers['content-length']);
    if (streamRes.headers['content-range'])
      res.setHeader('Content-Range', streamRes.headers['content-range']);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(streamRes.status);
    streamRes.data.pipe(res);
  } catch (err) {
    console.error('Stream error:', err.message);
    res.status(500).send('Stream error');
  }
});

// -------- Verify admin --------
app.post('/api/verify-admin', (req, res) => {
  const { adminPass } = req.body || {};
  if (adminPass === ADMIN_PASS) return res.json({ success: true });
  res.status(401).json({ success: false, error: 'Wrong password' });
});

// -------- Delete file --------
app.post('/api/delete/:id', async (req, res) => {
  const { adminPass } = req.body || {};
  if (adminPass !== ADMIN_PASS) return res.status(401).json({ error: 'Wrong password' });

  const meta = store.files[req.params.id];
  if (!meta) return res.status(404).json({ error: 'File not found' });

  let telegramDeleted = false;
  let telegramError = null;
  try {
    const r = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/deleteMessage`,
      { chat_id: CHANNEL_ID, message_id: meta.messageId },
      { timeout: 10000 }
    );
    telegramDeleted = r.data.ok === true;
  } catch (err) {
    telegramError = err.response?.data?.description || err.message;
    console.log(`⚠️ TG delete failed for "${meta.name}": ${telegramError}`);
  }

  delete store.files[req.params.id];
  saveStore();
  res.json({ success: true, telegramDeleted, note: telegramError });
});

// -------- Delete folder (recursive) --------
app.post('/api/delete-folder/:id', async (req, res) => {
  const { adminPass } = req.body || {};
  if (adminPass !== ADMIN_PASS) return res.status(401).json({ error: 'Wrong password' });

  const folder = store.folders[req.params.id];
  if (!folder) return res.status(404).json({ error: 'Folder not found' });

  // Collect all descendant files and folders
  const allFiles = [];
  const allFolders = [];

  function collect(fid) {
    allFolders.push(fid);
    Object.values(store.folders).forEach(f => {
      if (f.parentId === fid) collect(f.id);
    });
    Object.values(store.files).forEach(f => {
      if (f.parentId === fid) allFiles.push(f);
    });
  }
  collect(req.params.id);

  // Delete Telegram messages (best effort)
  let tgDeleted = 0, tgFailed = 0;
  for (const f of allFiles) {
    try {
      await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/deleteMessage`,
        { chat_id: CHANNEL_ID, message_id: f.messageId },
        { timeout: 8000 }
      );
      tgDeleted++;
    } catch {
      tgFailed++;
    }
  }

  // Remove from store
  allFiles.forEach(f => delete store.files[f.id]);
  allFolders.forEach(fid => delete store.folders[fid]);
  saveStore();

  res.json({
    success: true,
    foldersDeleted: allFolders.length,
    filesDeleted: allFiles.length,
    telegramDeleted: tgDeleted,
    telegramFailed: tgFailed
  });
});

// -------- Move file to another folder --------
app.post('/api/move-file/:id', (req, res) => {
  const { adminPass, targetFolderId } = req.body || {};
  if (adminPass !== ADMIN_PASS) return res.status(401).json({ error: 'Wrong password' });

  const file = store.files[req.params.id];
  if (!file) return res.status(404).json({ error: 'File not found' });

  const target = targetFolderId || null;
  if (target && !store.folders[target]) {
    return res.status(404).json({ error: 'Target folder not found' });
  }

  file.parentId = target;
  saveStore();
  res.json({ success: true, newParentId: target });
});

// -------- Move folder to another folder --------
app.post('/api/move-folder/:id', (req, res) => {
  const { adminPass, targetFolderId } = req.body || {};
  if (adminPass !== ADMIN_PASS) return res.status(401).json({ error: 'Wrong password' });

  const folder = store.folders[req.params.id];
  if (!folder) return res.status(404).json({ error: 'Folder not found' });

  const target = targetFolderId || null;
  if (target === req.params.id) {
    return res.status(400).json({ error: 'Cannot move folder into itself' });
  }
  if (target && !store.folders[target]) {
    return res.status(404).json({ error: 'Target folder not found' });
  }

  if (target && isDescendant(target, req.params.id)) {
    return res.status(400).json({ error: 'Cannot move folder into its own subfolder' });
  }

  const targetDepth = target ? getDepth(target) : 0;
  const subtreeMaxDepth = getMaxSubtreeDepth(req.params.id);
  if (targetDepth + subtreeMaxDepth > MAX_DEPTH) {
    return res.status(400).json({ error: `Would exceed ${MAX_DEPTH} level limit` });
  }

  const dup = Object.values(store.folders).find(
    f => f.id !== req.params.id &&
         f.parentId === target &&
         f.name.toLowerCase() === folder.name.toLowerCase()
  );
  if (dup) return res.status(400).json({ error: 'A folder with same name exists there' });

  folder.parentId = target;
  saveStore();
  res.json({ success: true, newParentId: target });
});

function getMaxSubtreeDepth(folderId) {
  let maxBelow = 0;
  function walk(id, current) {
    if (current > maxBelow) maxBelow = current;
    Object.values(store.folders).forEach(f => {
      if (f.parentId === id) walk(f.id, current + 1);
    });
  }
  walk(folderId, 0);
  return maxBelow;
}

// -------- Move file to another folder --------
app.post('/api/move-file/:id', (req, res) => {
  const { adminPass, targetFolderId } = req.body || {};
  if (adminPass !== ADMIN_PASS) return res.status(401).json({ error: 'Wrong password' });

  const file = store.files[req.params.id];
  if (!file) return res.status(404).json({ error: 'File not found' });

  const target = targetFolderId || null;
  if (target && !store.folders[target]) {
    return res.status(404).json({ error: 'Target folder not found' });
  }

  file.parentId = target;
  saveStore();
  res.json({ success: true });
});

// -------- Move folder to another folder --------
app.post('/api/move-folder/:id', (req, res) => {
  const { adminPass, targetFolderId } = req.body || {};
  if (adminPass !== ADMIN_PASS) return res.status(401).json({ error: 'Wrong password' });

  const folder = store.folders[req.params.id];
  if (!folder) return res.status(404).json({ error: 'Folder not found' });

  const target = targetFolderId || null;

  if (target === req.params.id) {
    return res.status(400).json({ error: 'Cannot move folder into itself' });
  }
  if (target && !store.folders[target]) {
    return res.status(404).json({ error: 'Target folder not found' });
  }
  if (target && isDescendant(target, req.params.id)) {
    return res.status(400).json({ error: 'Cannot move folder into its own subfolder' });
  }

  // Duplicate name check
  const dup = Object.values(store.folders).find(
    f => f.id !== req.params.id &&
         f.parentId === target &&
         f.name.toLowerCase() === folder.name.toLowerCase()
  );
  if (dup) return res.status(400).json({ error: 'Same folder name exists there' });

  folder.parentId = target;
  saveStore();
  res.json({ success: true });
});


// -------- Admin: all files & folders (flat list) --------
app.get('/api/all', (req, res) => {
  const files = Object.values(store.files).map(f => ({
    ...f,
    path: getPath(f.parentId).map(p => p.name).join(' / ') || 'Root'
  })).sort((a, b) => b.time - a.time);

  const folders = Object.values(store.folders).map(f => ({
    ...f,
    path: getPath(f.parentId).map(p => p.name).join(' / ') || 'Root',
    depth: getDepth(f.id)
  })).sort((a, b) => a.name.localeCompare(b.name));

  res.json({ files, folders });
});

// -------- Cleanup dead entries --------
app.post('/api/cleanup', async (req, res) => {
  const { adminPass } = req.body || {};
  if (adminPass !== ADMIN_PASS) return res.status(401).json({ error: 'Wrong password' });

  const ids = Object.keys(store.files);
  const removed = [];
  let kept = 0;
  for (const id of ids) {
    try {
      const r = await axios.get(
        `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${store.files[id].fileId}`,
        { timeout: 8000 }
      );
      if (r.data.ok) kept++;
      else { removed.push(store.files[id].name); delete store.files[id]; }
    } catch {
      removed.push(store.files[id].name);
      delete store.files[id];
    }
  }
  saveStore();
  res.json({ success: true, kept, removed: removed.length, removedFiles: removed });
});

// -------- Clean URLs --------
app.get('/upload', (req, res) => res.sendFile(path.join(__dirname, 'public', 'upload.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

// ============================================================
app.listen(PORT, '0.0.0.0', () => {
  console.log('===========================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Channel ID: ${CHANNEL_ID}`);
  console.log(`🔐 Admin password: ${ADMIN_PASS ? 'SET ✓' : 'NOT SET ❌'}`);
  console.log(`📁 Files: ${Object.keys(store.files).length}`);
  console.log(`📂 Folders: ${Object.keys(store.folders).length}`);
  console.log('===========================================');
});