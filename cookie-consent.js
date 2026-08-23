(() => {
  'use strict';

  // Global brand fallback. This script is loaded by photography pages too,
  // so the final uploaded Andrea Morel logo and favicon stay consistent site-wide.
  const isItalianPage = document.documentElement.lang.toLowerCase().startsWith('it');
  const brand = document.querySelector('.brand');
  const brandImage = brand?.querySelector('img');
  if (brand) {
    brand.href = isItalianPage ? '/it/' : '/';
    brand.setAttribute('aria-label', 'Andrea Morel — Home');
  }
  if (brandImage) {
    brandImage.src = '/assets/andrea-morel-logo-transparent.png?v=20260814-transparent1';
    brandImage.alt = 'Andrea Morel';
  }

  let siteFavicon = document.querySelector('link[rel="icon"]');
  if (!siteFavicon) {
    siteFavicon = document.createElement('link');
    siteFavicon.rel = 'icon';
    document.head.appendChild(siteFavicon);
  }
  siteFavicon.type = 'image/png';
  siteFavicon.href = '/assets/andrea-morel-favicon-transparent.png?v=20260814-final2';

  if (!document.querySelector('#andrea-morel-global-brand-styles')) {
    const brandStyle = document.createElement('style');
    brandStyle.id = 'andrea-morel-global-brand-styles';
    brandStyle.textContent = `
      .brand {
        width: 138px !important;
        height: 138px !important;
        border-radius: 0 !important;
        overflow: visible !important;
        box-shadow: none !important;
        display: block !important;
      }
      .brand img {
        width: 100% !important;
        height: 100% !important;
        object-fit: contain !important;
        display: block !important;
      }
      @media (max-width: 700px) {
        .brand { width: 110px !important; height: 110px !important; }
      }
    `;
    document.head.appendChild(brandStyle);
  }

  // share.js may add global navigation entries for older pages. Normalise archive
  // URLs and keep only one Archive/Archivio item in the main navigation.
  const mainNav = document.querySelector('#main-nav');
  if (mainNav) {
    const archivePath = isItalianPage ? '/archivio' : '/archive';
    const archiveLinks = Array.from(mainNav.querySelectorAll('a')).filter((link) => {
      try {
        const path = new URL(link.getAttribute('href') || link.href, window.location.origin).pathname
          .replace(/\/index\.html$/, '')
          .replace(/\.html$/, '')
          .replace(/\/$/, '');
        return path === archivePath;
      } catch {
        return false;
      }
    });
    archiveLinks.slice(1).forEach((link) => link.remove());
  }

  // Photography watermark: subtle visual overlay only; original files remain untouched.
  // Keep the mark proportional and discreet on both portrait and landscape photographs.
  if (document.body.classList.contains('photography-page') && !document.querySelector('#andrea-morel-watermark-styles')) {
    const watermarkStyle = document.createElement('style');
    watermarkStyle.id = 'andrea-morel-watermark-styles';
    watermarkStyle.textContent = `
      .photo-entry-image,
      .photo-detail-figure {
        position: relative;
      }
      .photo-entry-image::after,
      .photo-detail-figure::after {
        content: "";
        position: absolute;
        pointer-events: none;
        z-index: 3;
        width: 7%;
        min-width: 54px;
        max-width: 92px;
        aspect-ratio: 1.48 / 1;
        right: 24px;
        bottom: 24px;
        background: url('/assets/andrea-morel-watermark.png?v=20260813-final') center / contain no-repeat;
        opacity: .22;
      }
      @media (max-width: 700px) {
        .photo-entry-image::after,
        .photo-detail-figure::after {
          width: 9%;
          min-width: 42px;
          max-width: 68px;
          right: 14px;
          bottom: 14px;
          opacity: .20;
        }
      }
    `;
    document.head.appendChild(watermarkStyle);
  }

  const GA_ID = 'G-YG1ES87T2H';
  const STORAGE_KEY = 'andrea-morel-analytics-consent';

  const copy = {
    it: {
      message: 'Questo sito usa cookie analitici facoltativi per capire quali pagine vengono lette. Puoi accettarli o rifiutarli.',
      accept: 'Accetta',
      reject: 'Rifiuta',
      label: 'Preferenze cookie',
    },
    en: {
      message: 'This site uses optional analytics cookies to understand which pages are read. You can accept or reject them.',
      accept: 'Accept',
      reject: 'Reject',
      label: 'Cookie preferences',
    },
  };

  function getStoredConsent() {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch { return null; }
  }

  function storeConsent(value) {
    try { window.localStorage.setItem(STORAGE_KEY, value); } catch { /* current page only */ }
  }

  function loadGoogleAnalytics() {
    if (window.__andreaMorelAnalyticsLoaded) return;
    window.__andreaMorelAnalyticsLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });

    const analyticsScript = document.createElement('script');
    analyticsScript.async = true;
    analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    analyticsScript.dataset.consentLoaded = 'true';
    document.head.appendChild(analyticsScript);
  }

  function addBannerStyles() {
    if (document.querySelector('#cookie-consent-styles')) return;
    const style = document.createElement('style');
    style.id = 'cookie-consent-styles';
    style.textContent = `
      .cookie-consent { position:fixed; right:clamp(16px,3vw,40px); bottom:clamp(16px,3vw,40px); left:clamp(16px,3vw,40px); z-index:99999; border:1px solid rgba(238,233,222,.24); background:rgba(14,17,16,.97); color:#eee9de; box-shadow:0 22px 70px rgba(0,0,0,.52); backdrop-filter:blur(16px); }
      .cookie-consent__inner { width:min(1120px,100%); margin:0 auto; padding:22px 24px; display:flex; align-items:center; justify-content:space-between; gap:30px; }
      .cookie-consent p { max-width:760px; margin:0; color:inherit; font:17px/1.5 "Newsreader",Georgia,serif; }
      .cookie-consent__actions { display:flex; gap:10px; flex:0 0 auto; }
      .cookie-consent button { min-width:112px; padding:12px 18px; border:1px solid #eee9de; border-radius:0; font:10px/1 "DM Sans",Arial,sans-serif; letter-spacing:.16em; text-transform:uppercase; cursor:pointer; }
      .cookie-consent__reject { background:transparent; color:#eee9de; }
      .cookie-consent__accept { background:#eee9de; color:#090b0b; }
      .cookie-consent button:hover,.cookie-consent button:focus-visible { outline:2px solid #eee9de; outline-offset:3px; }
      @media (max-width:700px) { .cookie-consent__inner { padding:20px; flex-direction:column; align-items:stretch; gap:18px; } .cookie-consent__actions { display:grid; grid-template-columns:1fr 1fr; } .cookie-consent button { min-width:0; } }
    `;
    document.head.appendChild(style);
  }

  function showBanner() {
    if (document.querySelector('.cookie-consent')) return;
    const language = document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'it';
    const text = copy[language];
    addBannerStyles();

    const banner = document.createElement('section');
    banner.className = 'cookie-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', text.label);
    banner.setAttribute('aria-live', 'polite');
    banner.innerHTML = `<div class="cookie-consent__inner"><p>${text.message}</p><div class="cookie-consent__actions"><button class="cookie-consent__reject" type="button">${text.reject}</button><button class="cookie-consent__accept" type="button">${text.accept}</button></div></div>`;

    banner.querySelector('.cookie-consent__accept').addEventListener('click', () => { storeConsent('accepted'); loadGoogleAnalytics(); banner.remove(); });
    banner.querySelector('.cookie-consent__reject').addEventListener('click', () => { storeConsent('rejected'); banner.remove(); });
    document.body.appendChild(banner);
  }

  const consent = getStoredConsent();
  if (consent === 'accepted') loadGoogleAnalytics();
  else if (consent !== 'rejected') showBanner();
})();

// Reactions and comments are deliberately kept separate from analytics consent.
if ((document.body.classList.contains('article-page') || document.body.classList.contains('home-v2')) && !document.querySelector('script[data-morel-engagement]')) {
  const engagementScript = document.createElement('script');
  engagementScript.src = '/engagement.js?v=20260817-2';
  engagementScript.defer = true;
  engagementScript.dataset.morelEngagement = 'true';
  document.body.appendChild(engagementScript);
}

// MOREL 2.0: article journeys are driven by a separate editorial route map.
if (document.body.classList.contains('article-page') && !document.querySelector('script[data-morel-thread-engine], script[src^="/morel-thread-engine.js"]')) {
  const threadEngineScript = document.createElement('script');
  threadEngineScript.src = '/morel-thread-engine.js?v=20260820-1';
  threadEngineScript.dataset.morelThreadEngine = 'true';
  document.body.appendChild(threadEngineScript);
}

// MOREL audio: a short editorial voice-over for selected articles.
(() => {
  const path = window.location.pathname
    .replace(/\.html$/, '')
    .replace(/\/$/, '');

  const isItalianAudio = path === '/storie/non-siamo-obbligati-a-restare-uguali';
  const isEnglishAudio = path === '/stories/we-are-not-obliged-to-stay-the-same';
  if (!isItalianAudio && !isEnglishAudio) return;
  if (document.querySelector('.morel-audio')) return;

  const hero = document.querySelector('.article-hero');
  if (!hero) return;

  const strings = isEnglishAudio
    ? {
        aria: 'Listen to the voice-over for this article',
        label: 'Listen · MOREL Voice',
        note: 'A short voice track from this story',
        play: 'Play',
        pause: 'Pause',
        progress: 'Audio progress',
        src: '/assets/audio/ElevenLabs_2026-08-22T20_47_53_Miguel - Deep, Rich and Cinematic_pvc_sp104_s68_sb75_se11_b_m2.mp3',
      }
    : {
        aria: 'Ascolta il voice-over di questo articolo',
        label: 'Ascolta · Voce MOREL',
        note: 'Una traccia vocale da questo racconto',
        play: 'Riproduci',
        pause: 'Pausa',
        progress: 'Avanzamento audio',
        src: '/assets/audio/non-siamo-obbligati-a-restare-uguali.mp3',
      };

  const style = document.createElement('style');
  style.id = 'morel-audio-styles';
  style.textContent = `
    .morel-audio {
      width: min(1180px, calc(100% - 48px));
      margin: 0 auto 54px;
      border-top: 1px solid rgba(238,233,222,.16);
      border-bottom: 1px solid rgba(238,233,222,.16);
      padding: 22px 0;
      color: #eee9de;
    }
    .morel-audio__meta {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 16px;
    }
    .morel-audio__label {
      margin: 0;
      font: 500 9px/1.2 "DM Sans", Arial, sans-serif;
      letter-spacing: .24em;
      text-transform: uppercase;
      color: rgba(238,233,222,.72);
    }
    .morel-audio__note {
      margin: 0;
      font: 300 15px/1.4 "Newsreader", Georgia, serif;
      color: rgba(238,233,222,.58);
    }
    .morel-audio__controls {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 18px;
    }
    .morel-audio__play {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid rgba(238,233,222,.48);
      background: transparent;
      color: #eee9de;
      font: 14px/1 "DM Sans", Arial, sans-serif;
      cursor: pointer;
      transition: background .2s ease, color .2s ease, border-color .2s ease;
    }
    .morel-audio__play:hover,
    .morel-audio__play:focus-visible {
      background: #eee9de;
      color: #090b0b;
      border-color: #eee9de;
      outline: none;
    }
    .morel-audio__progress {
      width: 100%;
      accent-color: #eee9de;
      cursor: pointer;
    }
    .morel-audio__time {
      min-width: 82px;
      margin: 0;
      font: 400 10px/1 "DM Sans", Arial, sans-serif;
      letter-spacing: .12em;
      color: rgba(238,233,222,.58);
      text-align: right;
    }
    @media (max-width: 700px) {
      .morel-audio {
        width: calc(100% - 36px);
        margin-bottom: 38px;
        padding: 18px 0;
      }
      .morel-audio__meta {
        display: block;
      }
      .morel-audio__note {
        margin-top: 7px;
        font-size: 14px;
      }
      .morel-audio__controls {
        grid-template-columns: auto 1fr;
        gap: 14px;
      }
      .morel-audio__time {
        grid-column: 2;
        min-width: 0;
        text-align: left;
      }
    }
  `;
  document.head.appendChild(style);

  const section = document.createElement('section');
  section.className = 'morel-audio';
  section.setAttribute('aria-label', strings.aria);
  section.innerHTML = `
    <div class="morel-audio__meta">
      <p class="morel-audio__label">${strings.label}</p>
      <p class="morel-audio__note">${strings.note}</p>
    </div>
    <div class="morel-audio__controls">
      <button class="morel-audio__play" type="button" aria-label="${strings.play}">▶</button>
      <input class="morel-audio__progress" type="range" min="0" max="100" value="0" step="0.1" aria-label="${strings.progress}">
      <p class="morel-audio__time"><span class="morel-audio__current">0:00</span> / <span class="morel-audio__duration">--:--</span></p>
    </div>
  `;

  const audio = document.createElement('audio');
  audio.preload = 'metadata';
  audio.src = strings.src;
  section.appendChild(audio);
  hero.insertAdjacentElement('afterend', section);

  const play = section.querySelector('.morel-audio__play');
  const progress = section.querySelector('.morel-audio__progress');
  const current = section.querySelector('.morel-audio__current');
  const duration = section.querySelector('.morel-audio__duration');

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  audio.addEventListener('loadedmetadata', () => {
    duration.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    current.textContent = formatTime(audio.currentTime);
    progress.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  });

  play.addEventListener('click', async () => {
    if (audio.paused) {
      await audio.play();
      play.textContent = '❚❚';
      play.setAttribute('aria-label', strings.pause);
    } else {
      audio.pause();
      play.textContent = '▶';
      play.setAttribute('aria-label', strings.play);
    }
  });

  progress.addEventListener('input', () => {
    if (!audio.duration) return;
    audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  });

  audio.addEventListener('ended', () => {
    play.textContent = '▶';
    play.setAttribute('aria-label', strings.play);
    progress.value = 0;
    current.textContent = '0:00';
  });
})();