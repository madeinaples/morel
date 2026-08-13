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
    brandImage.src = '/assets/andrea-morel-logo.png?v=20260813-final2';
    brandImage.alt = 'Andrea Morel';
  }

  let siteFavicon = document.querySelector('link[rel="icon"]');
  if (!siteFavicon) {
    siteFavicon = document.createElement('link');
    siteFavicon.rel = 'icon';
    document.head.appendChild(siteFavicon);
  }
  siteFavicon.type = 'image/png';
  siteFavicon.href = '/assets/andrea-morel-favicon.png?v=20260813-final2';

  if (!document.querySelector('#andrea-morel-global-brand-styles')) {
    const brandStyle = document.createElement('style');
    brandStyle.id = 'andrea-morel-global-brand-styles';
    brandStyle.textContent = `
      .brand {
        width: 108px !important;
        height: 108px !important;
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
        .brand { width: 86px !important; height: 86px !important; }
      }
    `;
    document.head.appendChild(brandStyle);
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
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function storeConsent(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // The choice still applies for the current page when storage is unavailable.
    }
  }

  function loadGoogleAnalytics() {
    if (window.__andreaMorelAnalyticsLoaded) return;
    window.__andreaMorelAnalyticsLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };
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
      .cookie-consent {
        position: fixed;
        right: clamp(16px, 3vw, 40px);
        bottom: clamp(16px, 3vw, 40px);
        left: clamp(16px, 3vw, 40px);
        z-index: 99999;
        border: 1px solid rgba(238, 233, 222, .24);
        background: rgba(14, 17, 16, .97);
        color: #eee9de;
        box-shadow: 0 22px 70px rgba(0, 0, 0, .52);
        backdrop-filter: blur(16px);
      }
      .cookie-consent__inner {
        width: min(1120px, 100%);
        margin: 0 auto;
        padding: 22px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 30px;
      }
      .cookie-consent p {
        max-width: 760px;
        margin: 0;
        color: inherit;
        font: 17px/1.5 "Newsreader", Georgia, serif;
      }
      .cookie-consent__actions {
        display: flex;
        gap: 10px;
        flex: 0 0 auto;
      }
      .cookie-consent button {
        min-width: 112px;
        padding: 12px 18px;
        border: 1px solid #eee9de;
        border-radius: 0;
        font: 10px/1 "DM Sans", Arial, sans-serif;
        letter-spacing: .16em;
        text-transform: uppercase;
        cursor: pointer;
      }
      .cookie-consent__reject {
        background: transparent;
        color: #eee9de;
      }
      .cookie-consent__accept {
        background: #eee9de;
        color: #090b0b;
      }
      .cookie-consent button:hover,
      .cookie-consent button:focus-visible {
        outline: 2px solid #eee9de;
        outline-offset: 3px;
      }
      @media (max-width: 700px) {
        .cookie-consent__inner {
          padding: 20px;
          flex-direction: column;
          align-items: stretch;
          gap: 18px;
        }
        .cookie-consent__actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .cookie-consent button { min-width: 0; }
      }
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
    banner.innerHTML = `
      <div class="cookie-consent__inner">
        <p>${text.message}</p>
        <div class="cookie-consent__actions">
          <button class="cookie-consent__reject" type="button">${text.reject}</button>
          <button class="cookie-consent__accept" type="button">${text.accept}</button>
        </div>
      </div>
    `;

    banner.querySelector('.cookie-consent__accept').addEventListener('click', () => {
      storeConsent('accepted');
      loadGoogleAnalytics();
      banner.remove();
    });
    banner.querySelector('.cookie-consent__reject').addEventListener('click', () => {
      storeConsent('rejected');
      banner.remove();
    });

    document.body.appendChild(banner);
  }

  const consent = getStoredConsent();
  if (consent === 'accepted') {
    loadGoogleAnalytics();
  } else if (consent !== 'rejected') {
    showBanner();
  }
})();
