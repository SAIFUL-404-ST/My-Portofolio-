// ============================================================
// SAIF ELITE LIVE TV – DIRECT CODE INJECTION METHOD (100% FIX)
// ============================================================
(function () {
  function waitForDOM(cb) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', cb);
    else cb();
  }

  waitForDOM(async function () {
    const zone = window.getSaifToolZone ? window.getSaifToolZone() : document.getElementById('toolsPluginZone');
    if (!zone) { console.warn('Saif TV: toolsPluginZone not found'); return; }

    // স্ক্রিনশট অনুযায়ী তোমার গিটহাবের tv.html এর র (Raw) কোড লিংক
    const htmlRawUrl = 'https://raw.githubusercontent.com/SAIFUL-404-ST/My-Portofolio-/main/saif/tv.html';

    try {
      // ১. গিটহাব থেকে সরাসরি tv.html এর সম্পূর্ণ কোডটি টেক্সট হিসেবে টেনে আনা হচ্ছে
      const response = await fetch(htmlRawUrl);
      if (!response.ok) throw new Error('HTML load failed');
      const htmlText = await response.text();

      // ২. HTML কোড থেকে শুধু বডি বা ভেতরের অংশটুকু আলাদা করার জন্য একটি ডামি এলিমেন্ট তৈরি
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      
      // tv.html এর ভেতরের স্টাইল এবং মেইন কন্টেনার সিলেক্ট করা
      const tvStyle = doc.querySelector('style');
      const tvContainer = doc.querySelector('.tv-container');
      const tvScripts = doc.querySelectorAll('script');

      // ৩. আগের জ্যাম হওয়া প্লেয়ার পরিষ্কার করে নতুন কোড ইনজেক্ট করা
      zone.innerHTML = '';

      if (tvStyle) zone.appendChild(tvStyle.cloneNode(true));
      if (tvContainer) zone.appendChild(tvContainer.cloneNode(true));

      // ৪. স্ক্রিপ্টগুলো যাতে ঠিকঠাক কাজ করে, তাই নতুন করে স্ক্রিপ্ট ট্যাগ তৈরি করে রান করানো
      tvScripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.textContent;
        }
        document.body.appendChild(newScript);
      });

    } catch (error) {
      console.error('Saif TV Error:', error);
      zone.innerHTML = `<div style="color:#ff3333; text-align:center; padding:20px;">Live TV loaded failed. Please check internet or raw link.</div>`;
    }
  });
})();
