// ============================================================
// SAIF ELITE PLUGIN: HIGH-SPEED LIVE TV PLAYER (DIRECT GITHUB)
// ============================================================

(function () {
  // ১. প্রয়োজনীয় স্টাইলশীট ও ভিডিও প্লেয়ারের জন্য CSS যুক্ত করা
  const fontAwesome = document.createElement('link');
  fontAwesome.rel = 'stylesheet';
  fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
  document.head.appendChild(fontAwesome);

  const videoJsCss = document.createElement('link');
  videoJsCss.rel = 'stylesheet';
  videoJsCss.href = 'https://vjs.zencdn.net/8.10.0/video-js.css';
  document.head.appendChild(videoJsCss);

  // প্রিমিয়াম থিমিং ও ডিজাইন (গ্লোয়িং ইফেক্ট এবং কাস্টম নোটিফিকেশন ব্যানার)
  const style = document.createElement('style');
  style.textContent = `
    .tv-container {
      background: #111115;
      border-radius: 24px;
      padding: 24px;
      border: 1px solid rgba(255, 215, 0, 0.15);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(255, 215, 0, 0.02);
      margin-top: 20px;
      color: #ffffff;
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    .tv-title {
      font-size: 0.9rem;
      color: #ffd700;
      margin: 0 0 18px 0;
      letter-spacing: 2px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: bold;
      text-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
    }
    .player-wrapper {
      position: relative;
      width: 100%;
      border-radius: 16px;
      overflow: hidden;
      border: 1.5px solid rgba(255, 215, 0, 0.25);
      box-shadow: 0 12px 35px rgba(0,0,0,0.6);
      background: #000;
      margin-bottom: 20px;
    }
    .video-js {
      width: 100% !important;
      height: auto !important;
      aspect-ratio: 16 / 9;
    }
    .video-js .vjs-big-play-button {
      background: linear-gradient(135deg, #ff4500, #ff8c00) !important;
      border: none !important;
      color: #000 !important;
      border-radius: 50% !important;
      width: 65px !important;
      height: 65px !important;
      line-height: 65px !important;
      margin-left: -32px !important;
      margin-top: -32px !important;
      box-shadow: 0 0 20px rgba(255, 69, 0, 0.5);
    }
    
    /* কাস্টম নোটিফিকেশন ব্যানার */
    .tv-notice-box {
      background: rgba(255, 69, 0, 0.08);
      border: 1px dashed rgba(255, 140, 0, 0.4);
      border-radius: 14px;
      padding: 12px 16px;
      margin-bottom: 20px;
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

    .channel-list-title {
      font-size: 0.85rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 12px;
      opacity: 0.9;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .channel-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 12px;
      max-height: 260px;
      overflow-y: auto;
      padding-right: 5px;
    }
    .channel-grid::-webkit-scrollbar {
      width: 6px;
    }
    .channel-grid::-webkit-scrollbar-thumb {
      background: #ffd700;
      border-radius: 10px;
    }
    .channel-btn {
      padding: 12px 10px;
      border-radius: 12px;
      border: 1.5px solid rgba(255, 215, 0, 0.15);
      background: rgba(255, 215, 0, 0.03);
      color: #ffffff;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .channel-btn:hover {
      border-color: #ffd700;
      background: rgba(255, 215, 0, 0.08);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(255, 215, 0, 0.1);
    }
    .channel-btn.active {
      background: linear-gradient(135deg, #ff4500, #ff8c00);
      color: #000000;
      border-color: #ff8c00;
      box-shadow: 0 4px 18px rgba(255, 102, 0, 0.4);
    }
    .tv-status {
      font-size: 0.75rem;
      text-align: center;
      margin-top: 15px;
      opacity: 0.5;
      letter-spacing: 0.5px;
    }
    .tv-danger-msg {
      grid-column: 1/-1;
      text-align: center;
      padding: 20px;
      color: #ff3333;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);

  // ২. UI লেআউট এবং নোড জেনারেট করা
  const tvBox = document.createElement('div');
  tvBox.className = 'tv-container';
  tvBox.id = 'saif-livetv-box';

  tvBox.innerHTML = `
    <div class="tv-title"><i class="fas fa-circle-play fa-beat" style="color: red;"></i> Saif Live tv</div>
    
    <!-- Player Object -->
    <div class="player-wrapper">
      <video id="saif-tv-player" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto">
        <p class="vjs-no-js">To view this video please enable JavaScript or upgrade your browser.</p>
      </video>
    </div>

    <!-- বাংলা নোটিফিকেশন ব্যানার -->
    <div class="tv-notice-box">
      <i class="fas fa-triangle-exclamation"></i>
      <div>
        কিছু কিছু চ্যানেল সার্ভার ডাউন থাকার কারণে সাময়িকভাবে প্লে না-ও হতে পারে, যার জন্য আন্তরিকভাবে দুঃখিত। কোনো সমস্যা বা অভিযোগ থাকলে নিচে থাকা <strong>Contact Me</strong> ফরমের মাধ্যমে আমার সাথে যোগাযোগ করুন।
      </div>
    </div>

    <!-- Channel List Zone -->
    <div class="channel-list-title"><i class="fas fa-list-ul"></i> Select Channel:</div>
    <div class="channel-grid" id="tvChannelGrid">
      <div style="grid-column: 1/-1; text-align: center; padding: 20px; opacity: 0.7;">
        <i class="fas fa-circle-notch fa-spin"></i> Fetching Live Streams from Cloud Node...
      </div>
    </div>
    
    <div class="tv-status" id="tvStatusText">Data Pipeline: Secure Synchronized GitHub Hub</div>
  `;

  // প্লাগইন অ্যান্কর জোনে ইন্টিগ্রেশন (আপনার পোর্টফোলিওর স্ট্রাকচার অনুযায়ী)
  const targetZone = document.getElementById('toolsPluginZone') || document.getElementById('toolsContainer') || document.getElementById('live-tv-zone');
  if (targetZone) {
    targetZone.appendChild(tvBox);
  } else {
    document.body.appendChild(tvBox); // ফেইলসেফ রুট
  }

  // ৩. Video.js কোর ইঞ্জিন স্ক্রিপ্ট রান-টাইমে লোড করা
  const videoJsScript = document.createElement('script');
  videoJsScript.src = 'https://vjs.zencdn.net/8.10.0/video.js';
  document.body.appendChild(videoJsScript);

  videoJsScript.onload = function () {
    const player = videojs('saif-tv-player', {
      fluid: true,
      autoplay: false,
      controls: true
    });

    const gridContainer = document.getElementById('tvChannelGrid');
    const statusText = document.getElementById('tvStatusText');

    // আপনার দেওয়া ১,৩৯৯ লাইনের সরাসরি পাবলিক গিটহাব র লিংক
    const m3uUrl = 'https://raw.githubusercontent.com/tabassumtanha127t-dot/Iptv/refs/heads/main/tv.m3u';

    async function loadM3uPlaylist() {
      try {
        const response = await fetch(m3uUrl);
        if (!response.ok) throw new Error('Network response fetch failure');
        const text = await response.text();
        
        const channels = parseM3U(text);
        if (channels.length === 0) {
          gridContainer.innerHTML = '<div class="tv-danger-msg">No channels found inside playlist data.</div>';
          return;
        }

        renderChannels(channels, player);
      } catch (error) {
        console.error('[Saif Live TV Error]:', error);
        gridContainer.innerHTML = '<div class="tv-danger-msg"><i class="fas fa-circle-xmark"></i> Failed to connect data nodes. Try refreshing.</div>';
      }
    }

    // M3U স্ট্যান্ডার্ড পার্সার ইঞ্জিন
    function parseM3U(data) {
      const lines = data.split('\n');
      const result = [];
      let currentChannelName = '';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('#EXTINF:')) {
          const commaIndex = line.indexOf(',');
          if (commaIndex !== -1) {
            currentChannelName = line.substring(commaIndex + 1).trim();
          } else {
            currentChannelName = 'Live Stream';
          }
        } else if (line.startsWith('http://') || line.startsWith('https://')) {
          if (currentChannelName) {
            result.push({
              name: currentChannelName,
              url: line
            });
            currentChannelName = ''; // পয়েন্টার ক্লিয়ার
          }
        }
      }
      return result;
    }

    // ইউজার ইন্টারফেসে বাটন জেনারেট করা
    function renderChannels(channels, videoPlayer) {
      gridContainer.innerHTML = ''; // লোডার হাইড করা

      channels.forEach((channel, index) => {
        const btn = document.createElement('button');
        btn.className = 'channel-btn';
        btn.textContent = channel.name;
        btn.title = channel.name;

        btn.addEventListener('click', function () {
          document.querySelectorAll('.channel-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          videoPlayer.src({
            src: channel.url,
            type: 'application/x-mpegURL'
          });
          videoPlayer.play().catch(e => console.log('Autoplay block prevent:', e));
          
          statusText.innerHTML = `Playing: <span style="color: #ffd700; font-weight:bold;">${channel.name}</span>`;
        });

        gridContainer.appendChild(btn);

        // প্রথম চ্যানেলটি ডিফল্ট হিসেবে অটো-লোড হবে
        if (index === 0) {
          btn.classList.add('active');
          videoPlayer.src({
            src: channel.url,
            type: 'application/x-mpegURL'
          });
          statusText.innerHTML = `Ready: <span style="color: #ffd700; font-weight:bold;">${channel.name}</span>`;
        }
      });
    }

    loadM3uPlaylist();
  };
})();
