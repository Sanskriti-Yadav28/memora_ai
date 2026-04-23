/* ═══════════════════════════════════════════════════
   MEMORA AI — script.js
   All JavaScript logic for the Memora AI application
════════════════════════════════════════════════════ */

// ─── PHOTO DATA ───────────────────────────────────
const photos = [
  { icon: '🎂', name: 'Birthday party',  date: 'Mar 2022', tags: ['birthday','friends','cake','happy','celebration'], bg: '#E1F5EE' },
  { icon: '🏏', name: 'Cricket match',   date: 'Dec 2021', tags: ['cricket','sport','outdoor','playing','friends'],   bg: '#EFF6FF' },
  { icon: '🚴', name: 'Cycling trip',    date: 'Jan 2023', tags: ['bicycle','red bicycle','park','outdoor','cycling'], bg: '#FFF7ED' },
  { icon: '🌄', name: 'Sunset hike',     date: 'Aug 2022', tags: ['nature','outdoor','sunset','hiking','happy','travel'], bg: '#FFFBEB' },
  { icon: '🎉', name: 'New Year eve',    date: 'Jan 2023', tags: ['new year','celebration','friends','happy','party'], bg: '#F5F3FF' },
  { icon: '👨‍👩‍👧', name: 'Family dinner', date: 'Oct 2021', tags: ['family','dinner','happy','together','home'],      bg: '#EFF6FF' },
  { icon: '🏖️', name: 'Beach holiday',  date: 'May 2022', tags: ['beach','holiday','summer','outdoor','happy','travel'], bg: '#E1F5EE' },
  { icon: '🎓', name: 'Graduation day',  date: 'Jun 2022', tags: ['graduation','achievement','friends','happy','celebration'], bg: '#F5F3FF' },
  { icon: '🐶', name: 'With the dog',    date: 'Feb 2023', tags: ['dog','pet','happy','home','family'],               bg: '#FDF2F8' },
  { icon: '🌮', name: 'Food festival',   date: 'Nov 2022', tags: ['food','friends','outdoor','happy'],                bg: '#FFFBEB' },
  { icon: '✈️', name: 'Airport trip',    date: 'Apr 2022', tags: ['travel','airport','friends','outdoor'],            bg: '#EFF6FF' },
  { icon: '⚽', name: 'Football game',   date: 'Sep 2022', tags: ['football','sport','outdoor','friends','playing'],  bg: '#F0FDF4' },
];

// ─── GALLERY FILTER TAGS ──────────────────────────
const galFilters = {
  outdoor:     ['outdoor', 'nature', 'travel'],
  family:      ['family', 'home'],
  celebration: ['celebration', 'birthday', 'happy', 'party'],
  sport:       ['sport', 'cricket', 'cycling', 'football'],
  travel:      ['travel', 'beach', 'airport'],
};

// ─── SEARCH SCORING ───────────────────────────────
// Gives each photo a relevance score based on query words
function score(photo, query) {
  if (!query) return 1;
  const words = query.toLowerCase().split(' ').filter(w => w.length > 2);
  let s = 0;
  for (const tag of photo.tags) {
    if (query.toLowerCase().includes(tag)) s += 2;
    for (const word of words) {
      if (tag.includes(word) || word.includes(tag)) s += 1;
    }
  }
  if (photo.name.toLowerCase().includes(query.toLowerCase())) s += 3;
  return s;
}

// ─── RENDER SEARCH RESULTS ────────────────────────
function renderSearch(query) {
  const grid = document.getElementById('photoGrid');
  const meta = document.getElementById('resultsCount');
  grid.innerHTML = '';

  let list = photos.map(p => ({ ...p, score: score(p, query) }));
  if (query) {
    list = list.filter(p => p.score > 0).sort((a, b) => b.score - a.score);
  }

  meta.innerHTML = query
    ? `Found <strong>${list.length} memories</strong> matching <strong>"${query}"</strong>`
    : `Showing <strong>all ${photos.length} memories</strong>`;

  if (!list.length) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        No matching memories found for <strong>"${query}"</strong>
        <br>
        <small style="color:var(--text-hint);font-size:12px;margin-top:6px;display:block;">
          Try describing the moment differently
        </small>
      </div>`;
    return;
  }

  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.innerHTML = `
      <div class="photo-thumb" style="background:${p.bg}">
        <span style="font-size:44px;">${p.icon}</span>
      </div>
      <div class="photo-meta">
        <div class="photo-name">${p.name}</div>
        <div class="photo-date">${p.date}</div>
      </div>
      ${query ? `<div class="match-pill ${p.score > 3 ? '' : 'soft'}">${p.score > 3 ? 'Strong match' : 'Match'}</div>` : ''}
    `;
    card.onclick = () => showToast(`Opening "${p.name}"…`);
    grid.appendChild(card);
  });
}

// ─── RENDER GALLERY ───────────────────────────────
function renderGallery(filter) {
  const grid = document.getElementById('galGrid');
  grid.innerHTML = '';

  const list = (filter && filter !== 'all')
    ? photos.filter(p => p.tags.some(t => galFilters[filter]?.includes(t)))
    : photos;

  if (!list.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-hint);font-size:14px;">No photos in this category yet.</div>';
    return;
  }

  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'gal-card';
    card.innerHTML = `
      <div class="gal-thumb" style="background:${p.bg};">${p.icon}</div>
      <div class="gal-info">
        <div class="gal-name">${p.name}</div>
        <div class="gal-date">${p.date}</div>
      </div>
    `;
    card.onclick = () => showToast(`Viewing "${p.name}"`);
    grid.appendChild(card);
  });
}

// ─── NAVIGATION (SCREEN SWITCHING) ───────────────
function goto(screenId, navEl) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  // Remove active from all nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  // Show selected screen
  document.getElementById('screen-' + screenId).classList.add('active');
  navEl.classList.add('active');

  const titles = {
    search:    'Search memories',
    gallery:   'My gallery',
    upload:    'Upload photos',
    dashboard: 'Dashboard',
  };
  document.getElementById('pageTitle').textContent = titles[screenId];

  if (screenId === 'gallery') renderGallery('all');
}

// ─── SEARCH ACTIONS ───────────────────────────────
function doSearch() {
  const query = document.getElementById('searchInput').value.trim();
  renderSearch(query);
  if (query) showToast(`Searching for "${query}"…`);
}

function quickSearch(query) {
  document.getElementById('searchInput').value = query;
  renderSearch(query);
  showToast(`Searching for "${query}"…`);
}

// ─── GALLERY FILTER ───────────────────────────────
function filterGal(filter, btn) {
  document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGallery(filter);
}

// ─── UPLOAD: FILE HANDLING ────────────────────────
let queueItems = [];

function handleFiles(files) {
  const emptyEl = document.getElementById('queueEmpty');
  if (emptyEl) emptyEl.remove();

  document.getElementById('uploadActions').style.display = 'flex';

  const icons = ['🌅', '🎉', '🏞️', '📸', '🖼️', '🌺', '🎊', '🌿'];

  Array.from(files).forEach(file => {
    const id = 'q-' + Date.now() + Math.random().toString(36).slice(2);
    const sizeMB = (file.size / 1048576).toFixed(1);
    const icon = icons[Math.floor(Math.random() * icons.length)];

    const item = document.createElement('div');
    item.className = 'q-item';
    item.id = id;
    item.innerHTML = `
      <div class="q-icon">${icon}</div>
      <div class="q-info">
        <div class="q-name">${file.name}</div>
        <div class="q-size">${sizeMB} MB</div>
        <div class="q-bar-bg"><div class="q-bar" id="bar-${id}"></div></div>
      </div>
      <span class="q-status queued" id="status-${id}">Queued</span>
      <button class="q-remove" onclick="removeItem('${id}')">×</button>
    `;
    document.getElementById('queueList').appendChild(item);
    queueItems.push(id);
  });

  updateQueueCount();
}

// ─── UPLOAD: REMOVE ITEM ─────────────────────────
function removeItem(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
  queueItems = queueItems.filter(i => i !== id);
  updateQueueCount();

  if (!queueItems.length) {
    document.getElementById('uploadActions').style.display = 'none';
    const list = document.getElementById('queueList');
    if (!list.children.length) {
      const empty = document.createElement('div');
      empty.className = 'queue-empty';
      empty.id = 'queueEmpty';
      empty.innerHTML = 'No files added yet.<br/>Drop photos on the left to begin.';
      list.appendChild(empty);
    }
  }
}

// ─── UPLOAD: CLEAR ALL ───────────────────────────
function clearQueue() {
  queueItems.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
  queueItems = [];
  document.getElementById('uploadActions').style.display = 'none';
  updateQueueCount();

  const list = document.getElementById('queueList');
  const empty = document.createElement('div');
  empty.className = 'queue-empty';
  empty.id = 'queueEmpty';
  empty.innerHTML = 'No files added yet.<br/>Drop photos on the left to begin.';
  list.appendChild(empty);
}

// ─── UPLOAD: UPDATE FILE COUNT ───────────────────
function updateQueueCount() {
  const count = queueItems.length;
  document.getElementById('queueCount').textContent = count + ' file' + (count !== 1 ? 's' : '');
}

// ─── UPLOAD: START UPLOAD ANIMATION ─────────────
function startUpload() {
  if (!queueItems.length) return;
  showToast('Uploading and indexing photos with AI…');

  queueItems.forEach((id, index) => {
    const bar    = document.getElementById('bar-' + id);
    const status = document.getElementById('status-' + id);
    if (!bar || !status) return;

    status.textContent = 'Uploading';
    status.className   = 'q-status uploading';
    let progress = 0;

    // Stagger start time per file
    setTimeout(() => {
      const interval = setInterval(() => {
        progress += Math.random() * 12 + 6;

        // Switch label to Indexing at 70%
        if (progress >= 70 && status.textContent === 'Uploading') {
          status.textContent = 'Indexing';
          status.className   = 'q-status indexing';
        }

        // Complete at 100%
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          status.textContent = 'Done';
          status.className   = 'q-status done';
          if (bar) bar.style.width = '100%';

          // Check if all files are done
          const allDone = queueItems.every(qid => {
            const s = document.getElementById('status-' + qid);
            return s && s.textContent === 'Done';
          });
          if (allDone) showToast('All photos indexed! Head to Search to find them.');
        }

        if (bar) bar.style.width = Math.min(progress, 100) + '%';
      }, 180);
    }, index * 300);
  });
}

// ─── DRAG & DROP ─────────────────────────────────
const dropZone = document.getElementById('dropZone');

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag');
});
dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('drag');
});
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag');
  handleFiles(e.dataTransfer.files);
});

// ─── TOAST NOTIFICATION ──────────────────────────
let toastTimer;

function showToast(message) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ─── INITIALISE ON PAGE LOAD ─────────────────────
renderSearch('');
renderGallery('all');