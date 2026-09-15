// ============================================================
//  VAULT — Frontend (Folders + Files)
// ============================================================

const $ = id => document.getElementById(id);

// ---------- SVG icons ----------
const SVG = {
  image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
  video: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>`,
  audio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  pdf:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>`,
  zip:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>`,
  doc:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h6"/></svg>`,
  code:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m10 13-2 2 2 2M14 17l2-2-2-2"/></svg>`,
  file:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>`,
  folder: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V5a1 1 0 0 1 1-1h5l2 2h7a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7z"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>`,
  external: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l9-9 9 9M5 10v10h14V10"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
};

function pickIcon(mime = '', name = '') {
  if (mime.startsWith('image/')) return SVG.image;
  if (mime.startsWith('video/')) return SVG.video;
  if (mime.startsWith('audio/')) return SVG.audio;
  if (mime === 'application/pdf') return SVG.pdf;
  if (/zip|rar|7z|tar|gzip/.test(mime)) return SVG.zip;
  if (/word|document|sheet|excel|presentation/.test(mime)) return SVG.doc;
  if (/javascript|json|xml|html|css/.test(mime) || /\.(js|ts|py|go|rs|java|c|cpp|rb|php|sh)$/i.test(name)) return SVG.code;
  return SVG.file;
}

// ---------- Utils ----------
function fmtSize(b) {
  if (!b) return '0 B';
  const k = 1024, u = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return (b / Math.pow(k, i)).toFixed(1) + ' ' + u[i];
}
function fmtTime(ts) {
  const d = new Date(ts), n = new Date(), s = (n - d) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  if (s < 604800) return Math.floor(s / 86400) + 'd ago';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
function toast(msg, type = 'ok') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="dot"></span><span>${esc(msg)}</span>`;
  $('toasts').appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity 0.25s, transform 0.25s';
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    setTimeout(() => el.remove(), 250);
  }, 3000);
}

// ============================================================
function initVault({ mode }) {
  if (mode === 'public') initPublic();
  if (mode === 'upload') initUpload();
  if (mode === 'admin')  initAdmin();
}

// ============================================================
//  PUBLIC — Browse folders + files
// ============================================================
function initPublic() {
  const viewEl = $('view');
  const searchInput = $('searchInput');
  const breadcrumbEl = $('breadcrumb');
  const lightbox = $('lightbox');
  const lbStage = $('lbStage');
  const lbInfo = $('lbInfo');
  const lbBtns = $('lbBtns');
  const lbClose = $('lbClose');

  let currentFolder = null;
  let searchMode = false;

  async function loadBrowse(folderId = null) {
    searchMode = false;
    currentFolder = folderId;
    if (searchInput) searchInput.value = '';

    try {
      const ts = Date.now();
      const url = '/api/browse' + (folderId ? `?folder=${folderId}&_t=${ts}` : `?_t=${ts}`);
      const r = await fetch(url, { cache: 'no-store' });
      if (!r.ok) throw new Error('Load failed');
      const data = await r.json();
      renderBreadcrumb(data.path);
      renderBrowse(data);
      history.replaceState(null, '', folderId ? `#folder=${folderId}` : '#');
    } catch (e) {
      console.error(e);
      if (viewEl) viewEl.innerHTML = `<div class="empty"><div class="e-title">Failed to load</div></div>`;
    }
  }

  function renderBreadcrumb(path) {
    if (!breadcrumbEl) return;
    let html = `<span class="crumb${path.length === 0 ? ' current' : ''}" data-folder="">🏠 Root</span>`;
    path.forEach((p, i) => {
      const isLast = i === path.length - 1;
      html += `<span class="crumb-sep">›</span>`;
      html += `<span class="crumb${isLast ? ' current' : ''}" data-folder="${p.id}">${esc(p.name)}</span>`;
    });
    breadcrumbEl.innerHTML = html;
    breadcrumbEl.querySelectorAll('[data-folder]').forEach(el => {
      el.addEventListener('click', () => loadBrowse(el.dataset.folder || null));
    });
  }

  function renderBrowse(data) {
    const total = data.folders.length + data.files.length;

    if (total === 0) {
      viewEl.innerHTML = `
        <div class="empty">
          <div class="e-icon">${SVG.folder}</div>
          <div class="e-title">This folder is empty</div>
          <div class="e-sub">Nothing has been uploaded here yet</div>
        </div>`;
      return;
    }

    let html = '';

    if (data.folders.length) {
      html += `<div class="group-head">Folders <span class="cnt">${data.folders.length}</span></div>`;
      html += `<div class="file-list">`;
      data.folders.forEach(f => {
        html += `
          <div class="list-row" data-folder="${f.id}">
            <div class="row-icon folder-icon">${SVG.folder}</div>
            <div class="row-main">
              <div class="row-name">${esc(f.name)}</div>
              <div class="row-sub">Folder · ${esc(f.createdBy || 'Unknown')} · ${fmtTime(f.time)}</div>
            </div>
            <div class="row-actions">
              <button class="icon-btn" data-open="${f.id}" title="Open">${SVG.chevron}</button>
            </div>
          </div>`;
      });
      html += `</div>`;
    }

    if (data.files.length) {
      html += `<div class="group-head">Files <span class="cnt">${data.files.length}</span></div>`;
      html += `<div class="file-list">`;
      data.files.forEach(f => { html += publicFileRow(f); });
      html += `</div>`;
    }

    viewEl.innerHTML = html;
    wireBrowse();
  }

  function publicFileRow(f) {
    const title = f.title && f.title.trim() ? f.title : f.name;
    const isImg = f.mime?.startsWith('image/');

    return `
      <div class="list-row">
        <div class="row-icon ${isImg ? 'is-img' : ''}">
          ${isImg ? `<img src="/stream/${f.id}" loading="lazy" alt="">` : pickIcon(f.mime, f.name)}
        </div>
        <div class="row-main">
          <div class="row-name">${esc(title)}</div>
          <div class="row-sub">${esc(f.name)} · ${fmtSize(f.size)} · ${esc(f.uploader || 'Anonymous')} · ${fmtTime(f.time)}</div>
        </div>
        <div class="row-actions">
          <button class="icon-btn" data-view="${f.id}" title="View">${SVG.eye}</button>
          <button class="icon-btn" data-download="${f.id}" title="Download">${SVG.download}</button>
        </div>
      </div>`;
  }

  function wireBrowse() {
    viewEl.querySelectorAll('[data-folder]').forEach(el => {
      el.addEventListener('click', e => {
        if (e.target.closest('button')) return;
        loadBrowse(el.dataset.folder);
      });
    });
    viewEl.querySelectorAll('[data-open]').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        loadBrowse(el.dataset.open);
      });
    });
    viewEl.querySelectorAll('[data-view]').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        openViewer(el.dataset.view);
      });
    });
    viewEl.querySelectorAll('[data-download]').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        downloadFile(el.dataset.download);
      });
    });
  }

  async function doSearch(q) {
    if (!q.trim()) return loadBrowse(currentFolder);
    searchMode = true;
    try {
      const r = await fetch('/api/search?q=' + encodeURIComponent(q) + '&_t=' + Date.now(), { cache: 'no-store' });
      const data = await r.json();
      renderSearch(data, q);
    } catch (e) { console.error(e); }
  }

  function renderSearch(data, q) {
    const total = data.folders.length + data.files.length;

    if (breadcrumbEl) {
      breadcrumbEl.innerHTML = `<span class="crumb current">🔍 Results for "${esc(q)}"</span>`;
    }

    if (!total) {
      viewEl.innerHTML = `
        <div class="empty">
          <div class="e-icon">${SVG.file}</div>
          <div class="e-title">No results for "${esc(q)}"</div>
          <div class="e-sub">Try a different search term</div>
        </div>`;
      return;
    }

    let html = `<div class="search-info">Found <strong>${total}</strong> result(s)</div>`;

    if (data.folders.length) {
      html += `<div class="group-head">Folders <span class="cnt">${data.folders.length}</span></div><div class="file-list">`;
      data.folders.forEach(f => {
        html += `
          <div class="list-row" data-folder="${f.id}">
            <div class="row-icon folder-icon">${SVG.folder}</div>
            <div class="row-main">
              <div class="row-name">${esc(f.name)}</div>
              <div class="row-sub">Path: <span class="path-tag">${esc(f.path || 'Root')}</span></div>
            </div>
            <div class="row-actions">
              <button class="icon-btn" data-open="${f.id}">${SVG.chevron}</button>
            </div>
          </div>`;
      });
      html += `</div>`;
    }

    if (data.files.length) {
      html += `<div class="group-head">Files <span class="cnt">${data.files.length}</span></div><div class="file-list">`;
      data.files.forEach(f => {
        const title = f.title && f.title.trim() ? f.title : f.name;
        const isImg = f.mime?.startsWith('image/');
        html += `
          <div class="list-row">
            <div class="row-icon ${isImg ? 'is-img' : ''}">
              ${isImg ? `<img src="/stream/${f.id}" loading="lazy">` : pickIcon(f.mime, f.name)}
            </div>
            <div class="row-main">
              <div class="row-name">${esc(title)}</div>
              <div class="row-sub">Path: <span class="path-tag">${esc(f.path || 'Root')}</span> · ${fmtSize(f.size)}</div>
            </div>
            <div class="row-actions">
              <button class="icon-btn" data-view="${f.id}">${SVG.eye}</button>
              <button class="icon-btn" data-download="${f.id}">${SVG.download}</button>
            </div>
          </div>`;
      });
      html += `</div>`;
    }

    viewEl.innerHTML = html;
    wireBrowse();
  }

  async function openViewer(id) {
    let meta = null;
    try {
      const r = await fetch('/api/browse' + (currentFolder ? `?folder=${currentFolder}&_t=${Date.now()}` : `?_t=${Date.now()}`), { cache: 'no-store' });
      const data = await r.json();
      meta = data.files.find(f => f.id === id);
      if (!meta) {
        const r2 = await fetch('/api/search?q=' + id + '&_t=' + Date.now(), { cache: 'no-store' });
        const d2 = await r2.json();
        meta = d2.files.find(f => f.id === id);
      }
    } catch {}
    if (!meta) return toast('File not found', 'err');

    const url = `/stream/${id}`;
    const mime = meta.mime || '';
    const title = meta.title && meta.title.trim() ? meta.title : meta.name;

    let body = '';
    if (mime.startsWith('image/')) body = `<img src="${url}" alt="">`;
    else if (mime.startsWith('video/')) body = `<video src="${url}" controls autoplay playsinline></video>`;
    else if (mime.startsWith('audio/')) body = `<audio src="${url}" controls autoplay></audio>`;
    else if (mime === 'application/pdf' || mime.startsWith('text/')) body = `<iframe src="${url}"></iframe>`;
    else body = `<div class="lb-fallback">
      <div class="fb-icon">${pickIcon(mime, meta.name)}</div>
      <div class="fb-name">${esc(title)}</div>
      <div class="fb-sub">Preview not available</div>
    </div>`;

    lbStage.innerHTML = body;
    lbInfo.innerHTML = `<strong>${esc(title)}</strong> · ${fmtSize(meta.size)} · ${esc(meta.uploader || 'Anonymous')} · ${fmtTime(meta.time)}`;
    lbBtns.innerHTML = `
      <button class="lb-btn" data-dl>${SVG.download} Download</button>
      <a class="lb-btn" href="${url}" target="_blank" rel="noopener">${SVG.external} Open</a>
    `;
    lbBtns.querySelector('[data-dl]').addEventListener('click', () => downloadFile(id));

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function downloadFile(id) {
    const a = document.createElement('a');
    a.href = `/stream/${id}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast('Download started');
  }

  function closeViewer() {
    lightbox.classList.remove('open');
    lbStage.innerHTML = '';
    document.body.style.overflow = '';
  }

  lbClose?.addEventListener('click', closeViewer);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeViewer(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeViewer(); });

  if (searchInput) {
    let t;
    searchInput.addEventListener('input', e => {
      clearTimeout(t);
      const q = e.target.value.trim();
      if (!q) { loadBrowse(currentFolder); return; }
      t = setTimeout(() => doSearch(q), 300);
    });
  }

  const hash = location.hash.match(/folder=([a-f0-9]+)/);
  loadBrowse(hash ? hash[1] : null);
}

// ============================================================
//  UPLOAD — with folder browser + memory
// ============================================================
function initUpload() {
  const dropzone = $('dropzone');
  const fileInput = $('fileInput');
  const previewBox = $('previewBox');
  const previewContent = $('previewContent');
  const removeBtn = $('removeBtn');
  const titleInput = $('titleInput');
  const nameInput = $('nameInput');
  const uploadBtn = $('uploadBtn');
  const resetBtn = $('resetBtn');
  const progressLine = $('progressLine');
  const folderCrumbs = $('folderCrumbs');
  const folderBrowserEl = $('folderBrowser');

  let pickedFile = null;
  let busy = false;

  // ---- Folder memory across reloads ----
  let currentFolder = sessionStorage.getItem('upload_folder') || null;

  // ============ FOLDER BROWSER ============
  async function loadFolderOptions() {
    if (!folderBrowserEl) return;

    // Remember folder
    if (currentFolder) sessionStorage.setItem('upload_folder', currentFolder);
    else sessionStorage.removeItem('upload_folder');

    try {
      const url = '/api/browse' + (currentFolder ? `?folder=${currentFolder}` : '');
      const r = await fetch(url, { cache: 'no-store' });
      const data = await r.json();

      // If stored folder was deleted, reset
      if (currentFolder && !data.current) {
        currentFolder = null;
        sessionStorage.removeItem('upload_folder');
        return loadFolderOptions();
      }

      renderFolderBrowser(data);
    } catch (e) {
      console.error('Folder load error:', e);
    }
  }

  function renderFolderBrowser(data) {
    if (!folderBrowserEl) return;

    // Breadcrumb
    if (folderCrumbs) {
      let html = `<span class="crumb${!currentFolder ? ' current' : ''}" data-folder="">🏠 Root</span>`;
      data.path.forEach((p, i) => {
        const isLast = i === data.path.length - 1;
        html += `<span class="crumb-sep">›</span>`;
        html += `<span class="crumb${isLast ? ' current' : ''}" data-folder="${p.id}">${esc(p.name)}</span>`;
      });
      folderCrumbs.innerHTML = html;

      folderCrumbs.querySelectorAll('[data-folder]').forEach(el => {
        el.addEventListener('click', () => {
          const fid = el.dataset.folder || null;
          if (fid === currentFolder) return;
          currentFolder = fid;
          loadFolderOptions();
        });
      });
    }

    // Folder list
    let html = '';

    if (data.folders.length === 0) {
      html += `<div class="folder-empty">No sub-folders. Upload file here, or create a new folder.</div>`;
    } else {
      html += data.folders.map(f => `
        <div class="folder-option" data-id="${f.id}">
          <span class="fo-icon">📁</span>
          <span class="fo-name">${esc(f.name)}</span>
          <span class="fo-open" data-open="${f.id}">Open ›</span>
        </div>
      `).join('');
    }

    if (data.canCreateFolder) {
      html += `<button type="button" class="folder-new" id="newFolderBtnInline">+ New folder here</button>`;
    } else {
      html += `<div class="folder-limit">⚠️ Maximum 5 levels. Upload file to this folder.</div>`;
    }

    folderBrowserEl.innerHTML = html;

    // Wire click events
    folderBrowserEl.querySelectorAll('.folder-option').forEach(el => {
      el.addEventListener('click', e => {
        if (e.target.closest('[data-open]')) return;
        currentFolder = el.dataset.id;
        loadFolderOptions();
      });
    });

    folderBrowserEl.querySelectorAll('[data-open]').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        currentFolder = el.dataset.open;
        loadFolderOptions();
      });
    });

    const newBtn = folderBrowserEl.querySelector('#newFolderBtnInline');
    if (newBtn) {
      newBtn.addEventListener('click', () => createFolderInline());
    }
  }

  async function createFolderInline() {
    const name = prompt('New folder name:');
    if (!name || !name.trim()) return;

    try {
      const r = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          parentId: currentFolder,
          uploader: (nameInput?.value || 'Anonymous').trim()
        })
      });
      const d = await r.json();
      if (d.success) {
        toast('Folder created: ' + name);
        // Auto-enter new folder
        currentFolder = d.folder.id;
        loadFolderOptions();
      } else {
        toast(d.error || 'Failed to create folder', 'err');
      }
    } catch {
      toast('Network error', 'err');
    }
  }

  // ============ FILE PICKING ============
  dropzone?.addEventListener('click', () => fileInput.click());

  ['dragenter', 'dragover'].forEach(ev =>
    dropzone?.addEventListener(ev, e => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    })
  );
  ['dragleave', 'drop'].forEach(ev =>
    dropzone?.addEventListener(ev, e => {
      e.preventDefault();
      if (ev === 'dragleave' && dropzone.contains(e.relatedTarget)) return;
      dropzone.classList.remove('dragover');
    })
  );
  dropzone?.addEventListener('drop', e => {
    const f = e.dataTransfer.files?.[0];
    if (f) pickFile(f);
  });
  fileInput?.addEventListener('change', e => {
    const f = e.target.files?.[0];
    if (f) pickFile(f);
  });

  function pickFile(file) {
    if (file.size > 50 * 1024 * 1024) {
      toast('File is larger than 50 MB', 'err');
      return;
    }
    pickedFile = file;

    if (!titleInput.value.trim()) {
      const base = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim();
      titleInput.value = base.slice(0, 80);
    }

    renderPreview(file);
    uploadBtn.disabled = false;
  }

  function renderPreview(file) {
    previewBox.classList.add('show');
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      previewContent.innerHTML = `<img src="${url}" alt="">`;
    } else {
      previewContent.innerHTML = `
        <div class="preview-icon">
          ${pickIcon(file.type, file.name)}
          <div class="pname">${esc(file.name)}</div>
        </div>`;
    }
  }

  function clearPickedFile() {
    pickedFile = null;
    fileInput.value = '';
    previewBox.classList.remove('show');
    previewContent.innerHTML = '';
    titleInput.value = '';
    uploadBtn.disabled = true;
  }

  removeBtn?.addEventListener('click', e => {
    e.stopPropagation();
    clearPickedFile();
  });

  resetBtn?.addEventListener('click', () => {
    clearPickedFile();
    if (nameInput) nameInput.value = '';
    // Folder reset भी करें
    currentFolder = null;
    sessionStorage.removeItem('upload_folder');
    loadFolderOptions();
  });

  // ============ UPLOAD ============
  uploadBtn?.addEventListener('click', async () => {
    if (!pickedFile || busy) return;
    busy = true;
    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Uploading...';
    progressLine.style.width = '0%';

    const fd = new FormData();
    fd.append('file', pickedFile);
    fd.append('title', titleInput.value.trim().slice(0, 80));
    fd.append('uploader', nameInput.value.trim() || 'Anonymous');
    if (currentFolder) fd.append('parentId', currentFolder);

    try {
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload');
        xhr.upload.onprogress = e => {
          if (e.lengthComputable)
            progressLine.style.width = (e.loaded / e.total) * 100 + '%';
        };
        xhr.onload = () => {
          let d = {};
          try { d = JSON.parse(xhr.responseText); } catch {}
          if (xhr.status >= 200 && xhr.status < 300 && d.success) resolve(d);
          else reject(new Error(d.error || `Upload failed (${xhr.status})`));
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(fd);
      });

      progressLine.style.width = '100%';
      toast('Uploaded successfully');

      // ---- यहीं folder याद रखा जाता है ----
      pickedFile = null;
      fileInput.value = '';
      previewBox.classList.remove('show');
      previewContent.innerHTML = '';
      titleInput.value = '';
      uploadBtn.disabled = true;

      // Folder browser refresh (same folder!)
      loadFolderOptions();
    } catch (err) {
      console.error(err);
      toast(err.message || 'Upload failed', 'err');
    } finally {
      busy = false;
      uploadBtn.textContent = 'Upload';
      setTimeout(() => (progressLine.style.width = '0%'), 700);
      uploadBtn.disabled = !pickedFile;
    }
  });

  // ============ INIT ============
  loadFolderOptions();
}

// ============================================================
//  ADMIN
// ============================================================
function initAdmin() {
  const KEY = 'vault_pass';
  let pass = sessionStorage.getItem(KEY) || '';
  let currentFolder = null;
  let searchQuery = '';

  async function verify(p) {
    const r = await fetch('/api/verify-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminPass: p })
    });
    return (await r.json()).success === true;
  }

  async function trySessionLogin() {
    if (!pass) return;
    if (await verify(pass)) showDash();
    else { sessionStorage.removeItem(KEY); pass = ''; }
  }

  async function doLogin() {
    const p = $('pass').value.trim();
    if (!p) { $('loginErr').textContent = 'Enter password'; return; }
    $('loginErr').textContent = '';
    $('loginBtn').disabled = true;
    $('loginBtn').textContent = 'Signing in...';
    try {
      if (await verify(p)) {
        pass = p;
        sessionStorage.setItem(KEY, p);
        showDash();
      } else $('loginErr').textContent = 'Incorrect password';
    } catch { $('loginErr').textContent = 'Server error'; }
    finally {
      $('loginBtn').disabled = false;
      $('loginBtn').textContent = 'Sign in';
    }
  }

  $('loginBtn')?.addEventListener('click', doLogin);
  $('pass')?.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

  window.logout = function () {
    sessionStorage.removeItem(KEY);
    location.reload();
  };

  function showDash() {
    $('loginView').style.display = 'none';
    $('dashView').style.display = 'block';
    loadBrowse(null);
    loadStats();
  }

  async function loadStats() {
    try {
      const r = await fetch('/api/all?_t=' + Date.now(), { cache: 'no-store' });
      const d = await r.json();
      if ($('sTotal')) $('sTotal').textContent = d.files.length;
      if ($('sSize')) $('sSize').textContent = fmtSize(d.files.reduce((a, f) => a + (f.size || 0), 0));
      if ($('sFolders')) $('sFolders').textContent = d.folders.length;
      if ($('sImg')) $('sImg').textContent = d.files.filter(f => f.mime?.startsWith('image/')).length;
    } catch {}
  }

  async function loadBrowse(folderId = null) {
    currentFolder = folderId;
    searchQuery = '';
    const s = $('search');
    if (s) s.value = '';
    try {
      const ts = Date.now();
      const url = '/api/browse' + (folderId ? `?folder=${folderId}&_t=${ts}` : `?_t=${ts}`);
      const r = await fetch(url, { cache: 'no-store' });
      const data = await r.json();
      renderBrowse(data);
    } catch (e) { console.error(e); }
  }

  function renderBrowse(data) {
    const listEl = $('list');
    if (!listEl) return;

    const bc = $('adminBreadcrumb');
    if (bc) {
      let html = `<span class="acrumb${!currentFolder ? ' current' : ''}" data-folder="">🏠 Root</span>`;
      data.path.forEach((p, i) => {
        const isLast = i === data.path.length - 1;
        html += `<span class="acrumb-sep">›</span>`;
        html += `<span class="acrumb${isLast ? ' current' : ''}" data-folder="${p.id}">${esc(p.name)}</span>`;
      });
      bc.innerHTML = html;
      bc.querySelectorAll('[data-folder]').forEach(el => {
        el.addEventListener('click', () => loadBrowse(el.dataset.folder || null));
      });
    }

    const total = data.folders.length + data.files.length;
    if (total === 0) {
      listEl.innerHTML = `<div class="empty"><div class="e-title">Empty folder</div></div>`;
      return;
    }

    let html = '';

    if (data.folders.length) {
      html += `<div class="group-head">Folders <span class="cnt">${data.folders.length}</span></div><div class="file-list">`;
      data.folders.forEach(f => {
        const sn = esc(f.name).replace(/'/g, "\\'");
        html += `<div class="list-row" data-folder="${f.id}">
          <div class="row-icon folder-icon">${SVG.folder}</div>
          <div class="row-main">
            <div class="row-name">${esc(f.name)}</div>
            <div class="row-sub">Folder · ${esc(f.createdBy || 'Unknown')} · ${fmtTime(f.time)}</div>
          </div>
          <div class="row-actions">
            <button class="icon-btn" data-open="${f.id}">${SVG.chevron}</button>
            <button class="icon-btn" onclick="event.stopPropagation();window.__move('folder','${f.id}','${sn}')">📦</button>
            <button class="icon-btn danger" onclick="event.stopPropagation();window.__delFolder('${f.id}','${sn}')">${SVG.trash}</button>
          </div>
        </div>`;
      });
      html += `</div>`;
    }

    if (data.files.length) {
      html += `<div class="group-head">Files <span class="cnt">${data.files.length}</span></div><div class="file-list">`;
      data.files.forEach(f => {
        const isImg = f.mime?.startsWith('image/');
        const title = f.title && f.title.trim() ? f.title : f.name;
        const st = esc(title).replace(/'/g, "\\'");
        html += `<div class="list-row">
          <div class="row-icon ${isImg ? 'is-img' : ''}">${isImg ? `<img src="/stream/${f.id}" loading="lazy">` : pickIcon(f.mime, f.name)}</div>
          <div class="row-main">
            <div class="row-name">${esc(title)}</div>
            <div class="row-sub">${esc(f.name)} · ${fmtSize(f.size)} · ${esc(f.uploader || 'Anonymous')} · ${fmtTime(f.time)}</div>
          </div>
          <div class="row-actions">
            <button class="icon-btn" onclick="window.open('/stream/${f.id}','_blank')">${SVG.eye}</button>
            <button class="icon-btn" onclick="window.__move('file','${f.id}','${st}')">📦</button>
            <button class="icon-btn danger" onclick="window.__del('${f.id}','${st}')">${SVG.trash}</button>
          </div>
        </div>`;
      });
      html += `</div>`;
    }

    listEl.innerHTML = html;

    listEl.querySelectorAll('[data-folder]').forEach(el => {
      el.addEventListener('click', e => {
        if (e.target.closest('button')) return;
        loadBrowse(el.dataset.folder);
      });
    });
    listEl.querySelectorAll('[data-open]').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        loadBrowse(el.dataset.open);
      });
    });
  }

  const searchInput = $('search');
  if (searchInput) {
    let t;
    searchInput.addEventListener('input', e => {
      clearTimeout(t);
      const q = e.target.value.trim();
      if (!q) { loadBrowse(currentFolder); return; }
      t = setTimeout(() => doSearch(q), 300);
    });
  }

  async function doSearch(q) {
    searchQuery = q;
    try {
      const r = await fetch('/api/search?q=' + encodeURIComponent(q) + '&_t=' + Date.now(), { cache: 'no-store' });
      const data = await r.json();
      renderSearch(data, q);
    } catch (e) { console.error(e); }
  }

  function renderSearch(data, q) {
    const listEl = $('list');
    const bc = $('adminBreadcrumb');
    if (bc) bc.innerHTML = `<span class="acrumb current">🔍 Results for "${esc(q)}"</span>`;

    const total = data.folders.length + data.files.length;
    if (!total) {
      listEl.innerHTML = `<div class="empty"><div class="e-title">No results</div></div>`;
      return;
    }

    let html = `<div class="search-info">Found <strong>${total}</strong> result(s)</div>`;

    if (data.folders.length) {
      html += `<div class="group-head">Folders <span class="cnt">${data.folders.length}</span></div><div class="file-list">`;
      data.folders.forEach(f => {
        const sn = esc(f.name).replace(/'/g, "\\'");
        html += `<div class="list-row">
          <div class="row-icon folder-icon">${SVG.folder}</div>
          <div class="row-main">
            <div class="row-name">${esc(f.name)}</div>
            <div class="row-sub">Path: <span class="path-tag">${esc(f.path || 'Root')}</span></div>
          </div>
          <div class="row-actions">
            <button class="icon-btn" onclick="event.stopPropagation();window.__openFolder('${f.id}')">${SVG.chevron}</button>
            <button class="icon-btn" onclick="event.stopPropagation();window.__move('folder','${f.id}','${sn}')">📦</button>
            <button class="icon-btn danger" onclick="event.stopPropagation();window.__delFolder('${f.id}','${sn}')">${SVG.trash}</button>
          </div>
        </div>`;
      });
      html += `</div>`;
    }

    if (data.files.length) {
      html += `<div class="group-head">Files <span class="cnt">${data.files.length}</span></div><div class="file-list">`;
      data.files.forEach(f => {
        const isImg = f.mime?.startsWith('image/');
        const title = f.title && f.title.trim() ? f.title : f.name;
        const st = esc(title).replace(/'/g, "\\'");
        html += `<div class="list-row">
          <div class="row-icon ${isImg ? 'is-img' : ''}">${isImg ? `<img src="/stream/${f.id}" loading="lazy">` : pickIcon(f.mime, f.name)}</div>
          <div class="row-main">
            <div class="row-name">${esc(title)}</div>
            <div class="row-sub">Path: <span class="path-tag">${esc(f.path || 'Root')}</span> · ${fmtSize(f.size)}</div>
          </div>
          <div class="row-actions">
            <button class="icon-btn" onclick="window.open('/stream/${f.id}','_blank')">${SVG.eye}</button>
            <button class="icon-btn" onclick="window.__move('file','${f.id}','${st}')">📦</button>
            <button class="icon-btn danger" onclick="window.__del('${f.id}','${st}')">${SVG.trash}</button>
          </div>
        </div>`;
      });
      html += `</div>`;
    }

    listEl.innerHTML = html;
  }

  window.__openFolder = function (id) { loadBrowse(id); };

  window.__move = async function (kind, id, itemName) {
    const picker = document.createElement('div');
    picker.className = 'modal-picker';
    picker.innerHTML = `<div class="picker-box">
      <div class="picker-head">
        <div class="picker-title">Move "${esc(itemName)}"</div>
        <button class="picker-close" id="pickerClose">✕</button>
      </div>
      <div class="picker-crumbs" id="pickerCrumbs"></div>
      <div class="picker-list" id="pickerList"></div>
      <div class="picker-foot"><button class="btn btn-primary" id="pickerConfirm">Move here</button></div>
    </div>`;
    document.body.appendChild(picker);

    let targetFolderId = null;

    async function loadPicker(folderId) {
      try {
        const url = '/api/browse' + (folderId ? `?folder=${folderId}&_t=${Date.now()}` : `?_t=${Date.now()}`);
        const r = await fetch(url, { cache: 'no-store' });
        const data = await r.json();
        targetFolderId = folderId;

        const ce = picker.querySelector('#pickerCrumbs');
        let h = `<span class="pcrumb${!folderId ? ' current' : ''}" data-folder="">🏠 Root</span>`;
        data.path.forEach((p, i) => {
          const last = i === data.path.length - 1;
          h += `<span class="pcrumb-sep">›</span><span class="pcrumb${last ? ' current' : ''}" data-folder="${p.id}">${esc(p.name)}</span>`;
        });
        ce.innerHTML = h;
        ce.querySelectorAll('[data-folder]').forEach(el => {
          el.addEventListener('click', () => loadPicker(el.dataset.folder || null));
        });

        const le = picker.querySelector('#pickerList');
        let lh = '';
        if (folderId) lh += `<div class="picker-item" data-nav="__root__">🏠 <strong>Root (top level)</strong></div>`;

        const map = {};
        data.folders.forEach(f => { map[f.id] = f.parentId; });
        function isDesc(c, a) { let x = c; while (x) { if (x === a) return true; x = map[x]; } return false; }

        const vf = data.folders.filter(f => !(kind === 'folder' && (f.id === id || isDesc(f.id, id))));
        if (vf.length === 0) lh += `<div class="picker-empty">No sub-folders</div>`;
        else vf.forEach(f => {
          lh += `<div class="picker-item"><span class="pi-name" data-nav="${f.id}">📁 ${esc(f.name)}</span><span class="pi-open" data-nav="${f.id}">Open ›</span></div>`;
        });
        le.innerHTML = lh;
        le.querySelectorAll('[data-nav]').forEach(el => {
          el.addEventListener('click', e => {
            e.stopPropagation();
            const nav = el.dataset.nav;
            if (nav === '__root__') loadPicker(null);
            else loadPicker(nav);
          });
        });
      } catch (e) { console.error(e); }
    }

    picker.querySelector('#pickerClose').addEventListener('click', () => picker.remove());
    picker.addEventListener('click', e => { if (e.target === picker) picker.remove(); });

    picker.querySelector('#pickerConfirm').addEventListener('click', async () => {
      const ep = kind === 'file' ? '/api/move-file/' : '/api/move-folder/';
      try {
        const r = await fetch(ep + id, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adminPass: pass, targetFolderId })
        });
        const d = await r.json();
        if (d.success) {
          toast('Moved! Refreshing...');
          picker.remove();
          setTimeout(() => location.reload(), 700);
        } else toast(d.error || 'Failed', 'err');
      } catch { toast('Network error', 'err'); }
    });

    loadPicker(null);
  };

  window.__del = async function (id, title) {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      const r = await fetch('/api/delete/' + id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPass: pass })
      });
      const d = await r.json();
      if (d.success) { toast('Deleted'); loadBrowse(currentFolder); loadStats(); }
      else if (r.status === 401) { toast('Session expired', 'err'); logout(); }
      else toast(d.error || 'Failed', 'err');
    } catch { toast('Network error', 'err'); }
  };

  window.__delFolder = async function (id, name) {
    if (!confirm(`Delete folder "${name}"?\n\nAll contents will be deleted.`)) return;
    try {
      const r = await fetch('/api/delete-folder/' + id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPass: pass })
      });
      const d = await r.json();
      if (d.success) { toast(`Deleted ${d.filesDeleted} files`); loadBrowse(currentFolder); loadStats(); }
      else if (r.status === 401) { toast('Session expired', 'err'); logout(); }
      else toast(d.error || 'Failed', 'err');
    } catch { toast('Network error', 'err'); }
  };

  trySessionLogin();
}