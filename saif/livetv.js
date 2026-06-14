// ============================================================
// SAIF ELITE LIVE TV – 100% WORKING IFRAME BYPASS METHOD
// ============================================================
(function () {
  function waitForDOM(cb) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', cb);
    else cb();
  }

  waitForDOM(function () {
    const zone = window.getSaifToolZone ? window.getSaifToolZone() : document.getElementById('toolsPluginZone');
    if (!zone) { console.warn('Saif TV: toolsPluginZone not found'); return; }

    // ⚠️ এখানে আপনার সেই সফল HTML ফাইলটির লাইভ লিংকটি বসিয়ে দিন
    const myLiveTvHtmlUrl = 'https://raw.githack.com/tabassumtanha127t-dot/Iptv/main/tv.html'; 
    // (নোট: গিটহাবের র ফাইল হলে raw.githack.com ব্যবহার করলে সরাসরি ব্রাউজারে রান হয়)

    const iframeContainer = document.createElement('div');
    iframeContainer.style.width = '100%';
    iframeContainer.style.maxWidth = '500px';
    iframeContainer.style.margin = '0 auto';
    iframeContainer.style.background = '#121214';
    iframeContainer.style.borderRadius = '24px';
    iframeContainer.style.padding = '10px';
    iframeContainer.style.boxSizing = 'border-box';
    
    // আইফ্রেমের মাধ্যমে ডিরেক্ট ফাইলটি রান করা হচ্ছে, যা ডোমেইন সিকিউরিটি পুরোপুরি বাইপাস করবে
    iframeContainer.innerHTML = `
      <iframe src="${myLiveTvHtmlUrl}" 
              style="width:100%; height:620px; border:none; border-radius:16px; display:block;" 
              allow="autoplay; fullscreen; encrypted-media;" 
              allowfullscreen>
      </iframe>
    `;
    
    // আপনার টুল জোনে উইজেটটি যুক্ত করা
    zone.innerHTML = ''; // আগের জ্যাম হওয়া প্লেয়ার থাকলে তা পরিষ্কার করার জন্য
    zone.appendChild(iframeContainer);
  });
})();
