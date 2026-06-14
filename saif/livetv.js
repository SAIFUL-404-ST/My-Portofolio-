// ============================================================
// SAIF ELITE PLUGIN: DYNAMIC LIVE TV / IPTV PLAYER
// ============================================================

(function () {
  // ১. স্টাইলশীট ও ভিডিও প্লেয়ারের জন্য CSS যুক্ত করা
  const fontAwesome = document.createElement('link');
  fontAwesome.rel = 'stylesheet';
  fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
  document.head.appendChild(fontAwesome);

  const videoJsCss = document.createElement('link');
  videoJsCss.rel = 'stylesheet';
  videoJsCss.href = 'https://vjs.zencdn.net/8.10.0/video-js.css';
  document.head.appendChild(videoJsCss);

  // কাস্টম CSS (আপনার এলিট প্রোফাইলের ডার্ক এবং ফায়ার থিমের সাথে ম্যাচিং)
  const style = document.createElement('style');
  style.textContent = `
    .tv-container {
      background: var(--card-bg);
      border-radius: 24px;
      padding: 24px;
      border: 1px solid rgba(255,215,0,0.12);
      backdrop-filter: blur(20px);
      margin-top: 16px;
      color: var(--text);
    }
    .tv-title {
      font-size: 0.75rem;
      color: var(--gold);
      margin: 0 0 16px 0;
      letter-spacing: 2px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .player-wrapper {
      position: relative;
      width: 100%;
      border-radius: 16px;
      overflow: hidden;
      border: 1.5px solid rgba(255,215,0,0.2);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      background: #000;
      margin-bottom: 20px;
    }
    .video-js {
      width: 100% !important;
      height: auto !important;
      aspect-ratio: 16 / 9;
    }
    /* Video.js কাস্টম প্লে বাটন ফায়ার কালার */
    .video-js .vjs-big-play-button {
      background: linear-gradient(135deg, var(--fire1), var(--fire2)) !important;
      border: none !important;
      color: #000 !important;
      border-radius: 50% !important;
      width: 60px !important;
      height: 60px !important;
      line-height: 60px !important;
      margin-left: -30px !important;
      margin-top: -30px !important;
    }
    .channel-list-title {
      font-size: 0.8rem;
      font-weight: 800;
      color: var(--text);
      margin-bottom: 12px;
      opacity: 0.8;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .channel-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 10px;
      max-height: 250px;
      overflow-y: auto;
      padding-right: 5px;
    }
    /* স্ক্রলবার কাস্টমাইজেশন */
    .channel-grid::-webkit-scrollbar {
      width: 5px;
    }
    .channel-grid::-webkit-scrollbar-thumb {
      background: var(--gold);
      border-radius: 10px;
    }
    .channel-btn {
      padding: 12px 10px;
      border-radius: 12px;
      border: 1.5px solid rgba(255,215,0,0.15);
      background: rgba(255,215,0,0.04);
      color: var(--text);
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: all 0.3s ease;
    }
    .channel-btn:hover {
      border-color: var(--gold);
      background: rgba(255,215,0,0.1);
      transform: translateY(-2px);
    }
    .channel-btn.active {
      background: linear-gradient(135deg, var(--fire1), var(--fire2));
      color: #000;
      border-color: var(--fire2);
      box-shadow: 0 4px 15px rgba(255,102,0,0.3);
    }
    .tv-status {
      font-size: 0.75rem;
      text-align: center;
      margin-top: 10px;
      opacity: 0.6;
    }
  `;
  document.head.appendChild(style);

  // ২. UI স্ট্রাকচার তৈরি করা (এখানে "Saif Live tv" নাম সেট করা হয়েছে)
  const tvBox = document.createElement('div');
  tvBox.className = 'tv-container';
  tvBox.id = 'saif-livetv-box';

  tvBox.innerHTML = `
    <div class="tv-title"><i class="fas fa-tv"></i> Saif Live tv</div>
    
    <!-- প্লেয়ার সেকশন -->
    <div class="player-wrapper">
      <video id="saif-tv-player" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto">
        <p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that supports HTML5 video</p>
      </video>
    </div>

    <!-- চ্যানেল লিস্ট গ্রিড -->
    <div class="channel-list-title"><i class="fas fa-list-ul"></i> Select Channel:</div>
    <div class="channel-grid" id="tvChannelGrid">
      <div style="grid-column: 1/-1; text-align: center; padding: 20px; opacity: 0.7;">
        <i class="fas fa-spinner fa-spin"></i> Loading IPTV Channels...
      </div>
    </div>
    
    <div class="tv-status" id="tvStatusText">Powered by Saif Live tv</div>
  `;

  // ৩. প্লাগইন এঙ্কর (Anchor) জোনে যুক্ত করা
  const targetZone = document.getElementById('toolsPluginZone') || document.getElementById('toolsContainer');
  if (targetZone) {
    targetZone.appendChild(tvBox);
  } else {
    document.body.appendChild(tvBox);
  }

  // ৪. Video.js স্ক্রিপ্ট লোড করা এবং লাইভ স্ট্রিমিং লজিক এক্সিকিউট করা
  const videoJsScript = document.createElement('script');
  videoJsScript.src = 'https://vjs.zencdn.net/8.10.0/video.js';
  document.body.appendChild(videoJsScript);

  videoJsScript.onload = function () {
    const player = videojs('saif-tv-player', {
      fluid: true,
      playbackRates: [1],
      autoplay: false,
      controls: true
    });

    const m3uUrl = 'https://raw.githubusercontent.com/abusaeeidx/Mrgify-BDIX-IPTV/refs/heads/main/playlist.m3u';
    const gridContainer = document.getElementById('tvChannelGrid');
    const statusText = document.getElementById('tvStatusText');

    async function loadM3uPlaylist() {
      try {
        const response = await fetch(m3uUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();
        
        const channels = parseM3U(text);
        if (channels.length === 0) {
          gridContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--danger);">No channels found or parse error.</div>';
          return;
        }

        renderChannels(channels, player);
      } catch (error) {
        console.error('[Saif Live TV] Error:', error);
        gridContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--danger);"><i class="fas fa-exclamation-triangle"></i> Failed to load channels.</div>';
      }
    }

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
            currentChannelName = 'Unknown Channel';
          }
        } else if (line.startsWith('http://') || line.startsWith('https://')) {
          if (currentChannelName) {
            result.push({
              name: currentChannelName,
              url: line
            });
            currentChannelName = '';
          }
        }
      }
      return result;
    }

    function renderChannels(channels, videoPlayer) {
      gridContainer.innerHTML = ''; 

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
          videoPlayer.play();
          
          statusText.innerHTML = `Playing: <span style="color: var(--gold); font-weight:bold;">${channel.name}</span>`;
          
          if (typeof logUserActivity === 'function' && window.currentUser) {
            logUserActivity(window.currentUser, 'watched_tv_channel', { channelName: channel.name });
          }
        });

        gridContainer.appendChild(btn);

        if (index === 0) {
          btn.classList.add('active');
          videoPlayer.src({
            src: channel.url,
            type: 'application/x-mpegURL'
          });
          statusText.innerHTML = `Ready: <span style="color: var(--gold); font-weight:bold;">${channel.name}</span>`;
        }
      });
    }

    loadM3uPlaylist();
  };
})();
