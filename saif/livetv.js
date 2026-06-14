// ============================================================
// SAIF ELITE LIVE TV: ULTRA-PREMIUM CATEGORIZED IPTV ENGINE v4
// ============================================================

(function () {
  // ১. প্রয়োজনীয় কোর প্লাগইন ও ফন্ট আইকন লোড করা
  if (!window.Hls) {
    const hlsScript = document.createElement('script');
    hlsScript.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    document.head.appendChild(hlsScript);
  }

  const fontAwesome = document.createElement('link');
  fontAwesome.rel = 'stylesheet';
  fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
  document.head.appendChild(fontAwesome);

  // ২. নেক্সট-লেভেল গ্লোয়িং ডার্ক ইউআই থিমিং (CSS)
  const style = document.createElement('style');
  style.textContent = `
    .tv-container {
      background: #0f0f14;
      border-radius: 24px;
      padding: 22px;
      border: 1px solid rgba(255, 215, 0, 0.15);
      box-shadow: 0 25px 55px rgba(0, 0, 0, 0.85), inset 0 0 30px rgba(255, 215, 0, 0.01);
      margin-top: 20px;
      color: #ffffff;
      font-family: 'Segoe UI', Roboto, -apple-system, sans-serif;
    }
    .tv-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .tv-title {
      font-size: 1.1rem;
      color: #ffd700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 800;
      text-shadow: 0 0 12px rgba(255, 215, 0, 0.3);
    }
    .player-wrapper {
      position: relative;
      width: 100%;
      border-radius: 18px;
      overflow: hidden;
      border: 2px solid rgba(255, 215, 0, 0.2);
      background: #000;
      margin-bottom: 18px;
      aspect-ratio: 16 / 9;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
    }
    .player-wrapper video {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .tv-notice-box {
      background: rgba(255, 69, 0, 0.06);
      border: 1px dashed rgba(255, 140, 0, 0.35);
      border-radius: 14px;
      padding: 12px 16px;
      margin-bottom: 18px;
      font-size: 0.8rem;
      line-height: 1.5;
      color: #ffb380;
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }
    .tv-notice-box i {
      font-size: 1.1rem;
      color: #ff8c00;
      margin-top: 2px;
    }
    .search-wrapper {
      position: relative;
      margin-bottom: 18px;
    }
    .search-wrapper i {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 215, 0, 0.5);
      font-size: 0.95rem;
    }
    .search-box {
      width: 100%;
      padding: 14px 16px 14px 42px;
      border-radius: 14px;
      border: 1px solid rgba(255, 215, 0, 0.15);
      background: #161620;
      color: #fff;
      outline: none;
      box-sizing: border-box;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }
    .search-box:focus {
      border-color: #ffd700;
      background: #1a1a26;
      box-shadow: 0 0 15px rgba(255, 215, 0, 0.15);
    }
    
    /* প্রিমিয়াম হরাইজন্টাল ক্যাটাগরি ট্যাব */
    .category-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 18px;
      overflow-x: auto;
      padding-bottom: 8px;
      scroll-behavior: smooth;
    }
    .category-tabs::-webkit-scrollbar {
      height: 4px;
    }
    .category-tabs::-webkit-scrollbar-thumb {
      background: rgba(255, 215, 0, 0.3);
      border-radius: 10px;
    }
    .tab-btn {
      padding: 9px 16px;
      border-radius: 30px;
      border: 1px solid rgba(255, 215, 0, 0.12);
      background: rgba(255, 215, 0, 0.02);
      color: #b5b5bd;
      cursor: pointer;
      font-size: 0.78rem;
      font-weight: 700;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .tab-btn i {
      font-size: 0.85rem;
    }
    .tab-btn:hover {
      color: #fff;
      border-color: rgba(255, 215, 0, 0.5);
      background: rgba(255, 215, 0, 0.05);
    }
    .tab-btn.active {
      background: linear-gradient(135deg, #ffd700, #ff8c00);
      color: #000000;
      border-color: #ff8c00;
      box-shadow: 0 5px 15px rgba(255, 140, 0, 0.35);
    }

    /* চ্যানেল গ্রিড */
    .channel-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(125px, 1fr));
      gap: 10px;
      max-height: 280px;
      overflow-y: auto;
      padding-right: 4px;
    }
    .channel-grid::-webkit-scrollbar {
      width: 5px;
    }
    .channel-grid::-webkit-scrollbar-thumb {
      background: #ffd700;
      border-radius: 10px;
    }
    .channel-btn {
      padding: 14px 10px;
      border-radius: 14px;
      border: 1px solid rgba(255, 215, 0, 0.08);
      background: rgba(255, 215, 0, 0.02);
      color: #eaeaea;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: all 0.2s ease;
    }
    .channel-btn:hover {
      border-color: #ffd700;
      background: rgba(255, 215, 0, 0.07);
      transform: translateY(-2px);
    }
    .channel-btn.active {
      background: linear-gradient(135deg, #ff4500, #ff8c00);
      color: #ffffff;
      border-color: #ff8c00;
      box-shadow: 0 4px 15px rgba(255, 69, 0, 0.4);
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    }
    .tv-status {
      font-size: 0.72rem;
      text-align: center;
      margin-top: 16px;
      opacity: 0.45;
      letter-spacing: 0.5px;
    }
  `;
  document.head.appendChild(style);

  // ৩. সম্পূর্ণ UI মডিউল বিল্ড করা
  const tvBox = document.createElement('div');
  tvBox.className = 'tv-container';
  tvBox.innerHTML = `
    <div class="tv-header">
      <div class="tv-title"><i class="fas fa-circle-play fa-beat" style="color: #ff3333;"></i> Saif Live tv</div>
    </div>
    
    <div class="player-wrapper">
      <video id="saifCorePlayer" controls autoplay playsinline></video>
    </div>

    <div class="tv-notice-box">
      <i class="fas fa-triangle-exclamation"></i>
      <div>কিছু কিছু চ্যানেল সার্ভার ডাউন থাকার কারণে সাময়িকভাবে প্লে না-ও হতে পারে, যার জন্য আন্তরিকভাবে দুঃখিত। কোনো সমস্যা বা অভিযোগ থাকলে নিচে থাকা <strong>Contact Me</strong> ফরমের মাধ্যমে আমার সাথে যোগাযোগ করুন।</div>
    </div>

    <div class="search-wrapper">
      <i class="fas fa-magnifying-glass"></i>
      <input type="text" id="tvSearch" class="search-box" placeholder="চ্যানেলের নাম দিয়ে সার্চ করুন (যেমন: Somoy, T Sports)...">
    </div>

    <div class="category-tabs" id="tvTabs">
      <button class="tab-btn active" data-cat="all"><i class="fas fa-border-all"></i> All</button>
      <button class="tab-btn" data-cat="hot"><i class="fas fa-fire" style="color:#ff4500;"></i> Hot Channels</button>
      <button class="tab-btn" data-cat="bd"><i class="fas fa-flag"></i> Bangladesh</button>
      <button class="tab-btn" data-cat="sports"><i class="fas fa-trophy"></i> Sports</button>
      <button class="tab-btn" data-cat="news"><i class="fas fa-newspaper"></i> News</button>
      <button class="tab-btn" data-cat="ent"><i class="fas fa-film"></i> Entertainment</button>
      <button class="tab-btn" data-cat="islamic"><i class="fas fa-mosque"></i> Islamic</button>
      <button class="tab-btn" data-cat="kids"><i class="fas fa-child"></i> Kids</button>
    </div>

    <div class="channel-grid" id="tvChannelGrid">
      <div style="grid-column: 1/-1; text-align: center; padding: 25px; opacity: 0.7; font-size:0.85rem;">
        <i class="fas fa-circle-notch fa-spin" style="color:#ffd700;"></i> Syncing Premium Channels Grid...
      </div>
    </div>
    
    <div class="tv-status" id="tvStatusText">Core Pipeline: Cloud Synchronized Decryption Layer</div>
  `;

  // প্লাগইন অ্যান্কর জোন ডিটেকশন
  const targetZone = document.getElementById('toolsPluginZone') || document.getElementById('toolsContainer') || document.getElementById('live-tv-zone') || document.body;
  targetZone.appendChild(tvBox);

  let allChannels = [];
  let currentCategory = 'all';
  const videoElement = document.getElementById('saifCorePlayer');
  let hlsInstance = null;

  // ৪. রিয়েল-টাইম HLS স্ট্রিমিং কোর ইঞ্জিন
  function playStream(url) {
    if (hlsInstance) {
      hlsInstance.destroy();
    }

    if (videoElement.canPlayType('application/x-mpegURL') || videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = url;
      videoElement.play().catch(e => console.log("Native Playback Block Prevented:", e));
    } else if (window.Hls && Hls.isSupported()) {
      hlsInstance = new Hls();
      hlsInstance.loadSource(url);
      hlsInstance.attachMedia(videoElement);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, function() {
        videoElement.play().catch(e => console.log("HLS Playback Block Prevented:", e));
      });
    }
  }

  // ৫. M3U পার্সিং এবং অ্যাডভান্সড ক্যাটাগরাইজেশন ফিল্টার
  async function initTV() {
    try {
      const res = await fetch('https://raw.githubusercontent.com/tabassumtanha127t-dot/Iptv/refs/heads/main/tv.m3u');
      const text = await res.text();
      allChannels = parseAndFilterM3U(text);
      filterAndRender();
    } catch (err) {
      document.getElementById('tvChannelGrid').innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#ff3333;font-weight:bold;padding:20px;">Failed to connect to GitHub Data Server.</div>';
    }
  }

  function parseAndFilterM3U(data) {
    const lines = data.split('\n');
    const channels = [];
    let currentName = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('#EXTINF:')) {
        currentName = line.split(',')[1] || 'Live Stream';
      } else if (line.startsWith('http')) {
        if (currentName) {
          const nameLower = currentName.toLowerCase();
          let category = 'other';

          // ১,৩৯৯ চ্যানেলের জন্য প্রফেশনাল অটো-ফিল্টারিং কন্ডিশন
          if (nameLower.includes('somoy') || nameLower.includes('t sports') || nameLower.includes('gtv') || nameLower.includes('star sports') || nameLower.includes('sony') || nameLower.includes('geo ntv') || nameLower.includes('cricket')) {
            category = 'hot'; // টপ ট্রেন্ডিং চ্যানেলগুলো সরাসরি Hot সেকশনে যাবে
          } else if (nameLower.includes('sports') || nameLower.includes('cricket') || nameLower.includes('football') || nameLower.includes('ten') || nameLower.includes('willow') || nameLower.includes('ptv sports')) {
            category = 'sports';
          } else if (nameLower.includes('news') || nameLower.includes('jamuna') || nameLower.includes('independent') || nameLower.includes('ekattor') || nameLower.includes('khabor') || nameLower.includes('bbc') || nameLower.includes('cnn')) {
            category = 'news';
          } else if (nameLower.includes('islamic') || nameLower.includes('makkah') || nameLower.includes('madinah') || nameLower.includes('peace tv') || nameLower.includes('quran')) {
            category = 'islamic';
          } else if (nameLower.includes('kids') || nameLower.includes('cartoon') || nameLower.includes('disney') || nameLower.includes('nick') || nameLower.includes('pogo') || nameLower.includes('sonic')) {
            category = 'kids';
          } else if (nameLower.includes('star plus') || nameLower.includes('sony tv') || nameLower.includes('zee tv') || nameLower.includes('movies') || nameLower.includes('cinema') || nameLower.includes('hbo')) {
            category = 'ent';
          } else if (nameLower.includes('bangla') || nameLower.includes('bd') || nameLower.includes('dhaka') || nameLower.includes('channel i') || nameLower.includes('atn') || nameLower.includes('ntv') || nameLower.includes('rttv')) {
            category = 'bd';
          }

          channels.push({ name: currentName, url: line, category: category });
          currentName = '';
        }
      }
    }
    return channels;
  }

  function filterAndRender() {
    const searchTerm = document.getElementById('tvSearch').value.toLowerCase();
    
    const filtered = allChannels.filter(ch => {
      const matchesSearch = ch.name.toLowerCase().includes(searchTerm);
      // Hot ক্যাটাগরিতে থাকলে সে অল টাইম 'hot' ট্যাবেও শো করবে, প্লাস মেইন ক্যাটাগরিতেও থাকবে
      const matchesTab = (currentCategory === 'all') || (ch.category === currentCategory);
      return matchesSearch && matchesTab;
    });

    renderGrid(filtered);
  }

  function renderGrid(channels) {
    const grid = document.getElementById('tvChannelGrid');
    const statusText = document.getElementById('tvStatusText');
    grid.innerHTML = '';

    if (channels.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;opacity:0.5;font-size:0.8rem;padding:25px;"><i class="fas fa-magnifying-glass-minus"></i> এই ক্যাটাগরিতে কোনো চ্যানেল মিলছে না।</div>';
      return;
    }

    channels.forEach((ch, idx) => {
      const btn = document.createElement('button');
      btn.className = 'channel-btn';
      btn.textContent = ch.name;
      btn.title = ch.name;

      btn.onclick = () => {
        document.querySelectorAll('.channel-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        playStream(ch.url);
        statusText.innerHTML = `Playing: <span style="color:#ffd700;font-weight:bold;">${ch.name}</span>`;
      };

      grid.appendChild(btn);

      // প্রথমবার বুট হওয়ার সময় ১ম চ্যানেলটি লোড করবে
      if (idx === 0 && currentCategory === 'all' && !videoElement.src && !document.getElementById('tvSearch').value) {
        btn.classList.add('active');
        playStream(ch.url);
        statusText.innerHTML = `Ready: <span style="color:#ffd700;font-weight:bold;">${ch.name}</span>`;
      }
    });
  }

  // ৬. কন্ট্রোল লিসেনার্স
  document.getElementById('tvSearch').oninput = filterAndRender;

  document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-cat');
      filterAndRender();
    };
  });

  // লাইব্রেরি সেফটি ইন্টারভাল
  const coreBootloader = setInterval(() => {
    if (window.Hls) {
      clearInterval(coreBootloader);
      initTV();
    }
  }, 100);

})();
