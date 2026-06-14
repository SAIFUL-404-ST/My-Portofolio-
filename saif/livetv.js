// SAIF ELITE PLUGIN: ADVANCED SEARCH & FILTER SYSTEM
(function () {
  // আগের স্টাইলগুলো আপডেট করে সার্চ বারের জন্য নতুন স্টাইল যোগ করা হলো
  const style = document.createElement('style');
  style.textContent = `
    .tv-container { background: #111115; border-radius: 24px; padding: 20px; border: 1px solid #333; color: #fff; font-family: sans-serif; margin-top: 20px; }
    .search-box { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #444; background: #222; color: #fff; margin-bottom: 15px; outline: none; }
    .search-box:focus { border-color: #ffd700; }
    .tv-notice-box { background: rgba(255, 69, 0, 0.1); border: 1px dashed #ff8c00; border-radius: 10px; padding: 10px; margin-bottom: 15px; font-size: 0.75rem; color: #ffb380; }
    .channel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 8px; max-height: 250px; overflow-y: auto; padding: 5px; }
    .channel-btn { padding: 10px; border-radius: 8px; border: none; background: #333; color: #fff; cursor: pointer; font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .channel-btn:hover { background: #555; }
    .channel-btn.active { background: #ff4500; color: #fff; font-weight: bold; }
  `;
  document.head.appendChild(style);

  // UI জেনারেট
  const tvBox = document.createElement('div');
  tvBox.className = 'tv-container';
  tvBox.innerHTML = `
    <div style="color:#ffd700; font-weight:bold; margin-bottom:10px;">SAIF LIVE TV</div>
    <input type="text" id="tvSearch" class="search-box" placeholder="🔍 চ্যানেল সার্চ করুন (যেমন: Somoy, Geo)...">
    <div class="tv-notice-box">⚠️ সমস্যা হলে Contact Me এ জানান।</div>
    <div class="player-wrapper"><video id="saif-tv-player" class="video-js vjs-default-skin vjs-big-play-centered" controls></video></div>
    <div class="channel-grid" id="tvChannelGrid"></div>
  `;
  
  const targetZone = document.getElementById('toolsPluginZone') || document.body;
  targetZone.appendChild(tvBox);

  // লোড ও ফিল্টার লজিক
  const searchInput = document.getElementById('tvSearch');
  let allChannels = [];

  async function init() {
    const res = await fetch('https://raw.githubusercontent.com/tabassumtanha127t-dot/Iptv/refs/heads/main/tv.m3u');
    const text = await res.text();
    allChannels = parseM3U(text);
    render(allChannels);
  }

  function render(channels) {
    const grid = document.getElementById('tvChannelGrid');
    grid.innerHTML = '';
    channels.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'channel-btn';
      btn.textContent = ch.name;
      btn.onclick = () => {
        const player = videojs('saif-tv-player');
        player.src({ src: ch.url, type: 'application/x-mpegURL' });
        player.play();
        document.querySelectorAll('.channel-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      };
      grid.appendChild(btn);
    });
  }

  // সার্চ ফাংশন
  searchInput.oninput = () => {
    const term = searchInput.value.toLowerCase();
    const filtered = allChannels.filter(c => c.name.toLowerCase().includes(term));
    render(filtered);
  };

  function parseM3U(data) {
    const lines = data.split('\n');
    const res = [];
    let name = '';
    lines.forEach(line => {
      if (line.startsWith('#EXTINF:')) name = line.split(',')[1];
      else if (line.startsWith('http')) res.push({ name, url: line });
    });
    return res;
  }

  init();
})();
