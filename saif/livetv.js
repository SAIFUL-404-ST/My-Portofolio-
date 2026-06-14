// ============================================================
// SAIF ELITE – LIVE TV PLUGIN v1.0 (CORS Proxy + Sandbox)
// ============================================================
(function () {
  function waitForDOM(cb) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', cb);
    else cb();
  }

  waitForDOM(function () {
    const zone = window.getSaifToolZone ? window.getSaifToolZone() : document.getElementById('toolsPluginZone');
    if (!zone) { console.warn('LiveTV: toolsPluginZone not found'); return; }

    // ========== CSS ==========
    if (!document.getElementById('livetv-fontawesome')) {
      const fa = document.createElement('link');
      fa.id = 'livetv-fontawesome';
      fa.rel = 'stylesheet';
      fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
      document.head.appendChild(fa);
    }
    const style = document.createElement('style');
    style.textContent = `
      .live-tv-widget {
        background: #111115; border-radius: 24px; padding: 24px;
        border: 1px solid rgba(255,215,0,0.12);
        box-shadow: 0 20px 40px rgba(0,0,0,0.7);
        max-width: 700px; width: 100%; color: #fff;
        font-family: 'Outfit', sans-serif; margin-bottom: 20px;
      }
      .live-tv-widget .widget-header {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 20px;
      }
      .live-tv-widget .widget-logo {
        font-size: 1.4rem; font-weight: 900; color: #ffd700;
        letter-spacing: 1px;
      }
      .live-tv-widget .player-wrap {
        width: 100%; aspect-ratio: 16/9; border-radius: 16px; overflow: hidden;
        border: 2px solid rgba(255,215,0,0.2); background: #000;
        margin-bottom: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      }
      .live-tv-widget iframe { width: 100%; height: 100%; border: none; }
      .live-tv-widget .search-wrap {
        position: relative; margin-bottom: 15px;
      }
      .live-tv-widget .search-wrap i {
        position: absolute; left: 15px; top: 50%; transform: translateY(-50%);
        color: rgba(255,215,0,0.5);
      }
      .live-tv-widget .search-box {
        width: 100%; padding: 12px 16px 12px 40px; border-radius: 12px;
        border: 1px solid rgba(255,215,0,0.15); background: #1a1a22;
        color: #fff; outline: none; font-size: 0.9rem;
      }
      .live-tv-widget .search-box:focus { border-color: #ffd700; }
      .live-tv-widget .category-tabs {
        display: flex; gap: 6px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 15px;
      }
      .live-tv-widget .category-tabs::-webkit-scrollbar { height: 3px; }
      .live-tv-widget .category-tabs::-webkit-scrollbar-thumb { background: #ffd700; border-radius: 10px; }
      .live-tv-widget .tab-btn {
        padding: 8px 14px; border-radius: 20px; border: 1px solid rgba(255,215,0,0.1);
        background: rgba(255,215,0,0.02); color: #ccc; cursor: pointer;
        font-size: 0.75rem; font-weight: bold; white-space: nowrap;
      }
      .live-tv-widget .tab-btn.active {
        background: linear-gradient(135deg, #ff4500, #ff8c00); color: #000; border-color: #ff8c00;
      }
      .live-tv-widget .channel-grid {
        display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
        gap: 10px; max-height: 400px; overflow-y: auto; padding-right: 5px;
      }
      .live-tv-widget .channel-grid::-webkit-scrollbar { width: 5px; }
      .live-tv-widget .channel-grid::-webkit-scrollbar-thumb { background: #ffd700; border-radius: 10px; }
      .live-tv-widget .channel-card {
        background: #121214; border: 1.5px solid rgba(255,215,0,0.1);
        border-radius: 12px; padding: 12px 8px; text-align: center; cursor: pointer;
        transition: all 0.3s; display: flex; flex-direction: column; align-items: center; gap: 8px;
      }
      .live-tv-widget .channel-card:hover {
        border-color: #ffd700; background: rgba(255,215,0,0.05); transform: translateY(-2px);
      }
      .live-tv-widget .channel-card.active {
        border-color: #ff8c00; background: rgba(255,140,0,0.15);
      }
      .live-tv-widget .channel-logo {
        width: 60px; height: 60px; border-radius: 12px; object-fit: contain; background: #1a1a22; padding: 5px;
      }
      .live-tv-widget .channel-name {
        font-size: 0.75rem; font-weight: 700; line-height: 1.2; color: #fff; word-break: break-word;
      }
      .live-tv-widget .status {
        text-align: center; margin-top: 15px; opacity: 0.6; font-size: 0.8rem;
      }
    `;
    document.head.appendChild(style);

    // ========== HTML ==========
    const widget = document.createElement('div');
    widget.className = 'live-tv-widget';
    widget.innerHTML = `
      <div class="widget-header">
        <div class="widget-logo">🏆 Saif Elite Live TV</div>
      </div>
      <div class="player-wrap">
        <iframe id="livetvPlayer" sandbox="allow-scripts" allow="autoplay; fullscreen"></iframe>
      </div>
      <div class="search-wrap">
        <i class="fas fa-search"></i>
        <input type="text" id="livetvSearch" class="search-box" placeholder="চ্যানেল খুঁজুন...">
      </div>
      <div class="category-tabs" id="livetvTabs">
        <button class="tab-btn active" data-cat="all">All</button>
      </div>
      <div class="channel-grid" id="livetvGrid">
        <div style="grid-column:1/-1; text-align:center; padding:20px; opacity:0.7;">লোড হচ্ছে...</div>
      </div>
      <div class="status" id="livetvStatus">Ready</div>
    `;
    zone.appendChild(widget);

    // ========== কনফিগ ==========
    const M3U_URL = "https://raw.githubusercontent.com/abusaeeidx/Mrgify-BDIX-IPTV/main/playlist.m3u";
    const PROXY_BASE = "https://corsproxy.io/?";
    let allChannels = [], currentCategory = "all";

    // ========== স্যান্ডবক্স প্লেয়ার ==========
    function getPlayerHTML(streamUrl) {
      const escapedUrl = streamUrl.replace(/'/g, "\\'");
      const isTs = streamUrl.toLowerCase().endsWith('.ts');
      const srcType = isTs ? 'video/mp2t' : 'application/x-mpegURL';

      return `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://vjs.zencdn.net/8.10.0/video-js.css">
  <style>
    body { margin:0; background:#000; display:flex; align-items:center; justify-content:center; height:100vh; }
    .video-js { width:100% !important; height:100% !important; }
    .video-js .vjs-big-play-button {
      background: linear-gradient(135deg, #ff4500, #ff8c00) !important;
      border: none !important; color: #000 !important; border-radius: 50% !important;
      width: 60px !important; height: 60px !important; line-height: 60px !important;
      margin-left: -30px !important; margin-top: -30px !important;
    }
  </style>
</head>
<body>
  <video id="player" class="video-js vjs-default-skin vjs-big-play-centered" controls autoplay></video>
  <script src="https://vjs.zencdn.net/8.10.0/video.js"><\\/script>
  <script>
    const PROXY = '${PROXY_BASE}';
    const originalUrl = '${escapedUrl}';
    const player = videojs('player', { fluid: true, autoplay: true, controls: true });

    async function start() {
      let finalUrl = originalUrl;
      // HTTP পেজে থাকলে সরাসরি, HTTPS হলে প্রক্সি
      if (originalUrl.startsWith('http://') && window.isSecureContext) {
        finalUrl = PROXY + encodeURIComponent(originalUrl);
      }
      try {
        if (originalUrl.endsWith('.m3u8')) {
          const resp = await fetch(finalUrl);
          const text = await resp.text();
          const lines = text.split('\\n');
          const base = originalUrl.substring(0, originalUrl.lastIndexOf('/') + 1);
          const newLines = lines.map(function(line) {
            const trimmed = line.trim();
            if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
              return PROXY + encodeURIComponent(trimmed);
            } else if (trimmed && !trimmed.startsWith('#')) {
              const absUrl = new URL(trimmed, base).href;
              return PROXY + encodeURIComponent(absUrl);
            }
            return line;
          });
          const blob = new Blob([newLines.join('\\n')], { type: 'application/vnd.apple.mpegurl' });
          player.src({ src: URL.createObjectURL(blob), type: 'application/x-mpegURL' });
        } else {
          player.src({ src: finalUrl, type: '${srcType}' });
        }
        player.play();
      } catch(e) {
        // fallback
        player.src({ src: finalUrl, type: '${srcType}' });
        player.play();
      }
    }
    start();
  <\\/script>
</body>
</html>`;
    }

    function playChannel(url, name) {
      const iframe = document.getElementById('livetvPlayer');
      const blob = new Blob([getPlayerHTML(url)], { type: 'text/html' });
      iframe.src = URL.createObjectURL(blob);
      document.getElementById('livetvStatus').innerHTML = `Playing: <span style="color:#ffd700;font-weight:bold;">${name}</span>`;
    }

    // ========== M3U পার্সিং ==========
    async function loadM3U() {
      try {
        const res = await fetch(M3U_URL);
        const text = await res.text();
        allChannels = parseM3U(text);
        populateCategories();
        filterAndRender();
      } catch (e) {
        document.getElementById('livetvGrid').innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#ff3333;">M3U fetch failed</div>';
      }
    }

    function parseM3U(data) {
      const lines = data.split('\n');
      const result = [];
      let name = '', logo = '', group = '';
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('#EXTINF:')) {
          const comma = line.indexOf(',');
          if (comma !== -1) {
            name = line.substring(comma + 1).trim();
            const attr = line.substring(8, comma);
            const logoMatch = attr.match(/tvg-logo="([^"]*)"/);
            logo = logoMatch ? logoMatch[1] : '';
            const groupMatch = attr.match(/group-title="([^"]*)"/);
            group = groupMatch ? groupMatch[1] : '';
          }
        } else if (line.startsWith('http')) {
          if (name) {
            result.push({ name, url: line, logo, group });
            name = ''; logo = ''; group = '';
          }
        }
      }
      return result;
    }

    function populateCategories() {
      const cats = [...new Set(allChannels.map(ch => {
        const parts = ch.group.split('|');
        return parts[0].trim() || 'Other';
      }))].sort();

      const tabs = document.getElementById('livetvTabs');
      tabs.innerHTML = '<button class="tab-btn active" data-cat="all">All</button>';
      cats.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn';
        btn.setAttribute('data-cat', cat);
        btn.textContent = cat;
        btn.addEventListener('click', () => {
          document.querySelectorAll('#livetvTabs .tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentCategory = cat;
          filterAndRender();
        });
        tabs.appendChild(btn);
      });
      document.querySelector('#livetvTabs [data-cat="all"]').addEventListener('click', () => {
        document.querySelectorAll('#livetvTabs .tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('#livetvTabs [data-cat="all"]').classList.add('active');
        currentCategory = 'all';
        filterAndRender();
      });
    }

    function filterAndRender() {
      const term = document.getElementById('livetvSearch').value.toLowerCase();
      const filtered = allChannels.filter(ch => {
        const matchSearch = ch.name.toLowerCase().includes(term);
        if (currentCategory === 'all') return matchSearch;
        const cat = ch.group.split('|')[0].trim() || 'Other';
        return cat === currentCategory && matchSearch;
      });
      renderGrid(filtered);
    }

    function renderGrid(channels) {
      const grid = document.getElementById('livetvGrid');
      grid.innerHTML = '';
      if (!channels.length) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;opacity:0.6;padding:15px;">কোনো চ্যানেল নেই</div>';
        return;
      }
      channels.forEach(ch => {
        const card = document.createElement('div');
        card.className = 'channel-card';
        card.innerHTML = `
          <img class="channel-logo" src="${ch.logo || 'https://via.placeholder.com/60/1a1a22/ffd700?text=TV'}" 
               onerror="this.src='https://via.placeholder.com/60/1a1a22/ffd700?text=TV'">
          <div class="channel-name">${ch.name}</div>
        `;
        card.addEventListener('click', () => {
          document.querySelectorAll('#livetvGrid .channel-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          playChannel(ch.url, ch.name);
        });
        grid.appendChild(card);
      });
    }

    // ইভেন্ট
    document.getElementById('livetvSearch').addEventListener('input', filterAndRender);
    loadM3U();
  });
})();
