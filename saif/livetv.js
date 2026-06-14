// ============================================================
// SAIF ELITE LIVE TV – PLUG-IN IFRAME METHOD (CORRECT PATH)
// ============================================================
(function () {
  function waitForDOM(cb) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', cb);
    else cb();
  }

  waitForDOM(function () {
    const zone = window.getSaifToolZone ? window.getSaifToolZone() : document.getElementById('toolsPluginZone');
    if (!zone) { console.warn('Saif TV: toolsPluginZone not found'); return; }

    // 🔥 তোমার স্ক্রিনশট (1000219951.jpg) অনুযায়ী একদম সঠিক লাইভ githack লিংক
    const myLiveTvHtmlUrl = 'https://raw.githack.com/SAIFUL-404-ST/My-Portofolio-/main/saif/tv.html'; 

    const iframeContainer = document.createElement('div');
    iframeContainer.style.width = '100%';
    iframeContainer.style.maxWidth = '520px';
    iframeContainer.style.margin = '0 auto';
    
    // এই জানালাটি প্লাগইনের কড়া সিকিউরিটি বাইপাস করে T Sports প্লে করবে
    iframeContainer.innerHTML = `
      <iframe src="${myLiveTvHtmlUrl}" 
              style="width:100%; height:620px; border:none; border-radius:24px; display:block; overflow:hidden;" 
              allow="autoplay; fullscreen; encrypted-media;" 
              scrolling="no"
              allowfullscreen>
      </iframe>
    `;
    
    zone.innerHTML = ''; // আগের প্লেয়ার পরিষ্কার করা
    zone.appendChild(iframeContainer); // নতুন আইফ্রেম প্লেয়ার যুক্ত করা
  });
})();
