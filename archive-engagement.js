(() => {
  'use strict';

  if (!document.body.classList.contains('archive-page')) return;

  const API = '/.netlify/functions/engagement';

  function contentKeyFromUrl(url) {
    try {
      const path = new URL(url, window.location.origin).pathname;
      return path.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/$/, '') || '/';
    } catch {
      return '';
    }
  }

  function addStyles() {
    if (document.querySelector('#morel-archive-engagement-styles')) return;
    const style = document.createElement('style');
    style.id = 'morel-archive-engagement-styles';
    style.textContent = `
      .archive-engagement {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
        color: inherit;
        font: 400 10px/1 "DM Sans", Arial, sans-serif;
        letter-spacing: .04em;
        opacity: .58;
        white-space: nowrap;
      }
      .archive-engagement span {
        display: inline-flex;
        align-items: center;
        gap: 3px;
      }
      .archive-item:hover .archive-engagement,
      .archive-item:focus-visible .archive-engagement {
        opacity: .9;
      }
      @media (max-width: 700px) {
        .archive-engagement {
          margin-top: 7px;
          gap: 8px;
          font-size: 9px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  async function getSummary(content) {
    const response = await fetch(`${API}?content=${encodeURIComponent(content)}&summary=1`, {
      headers: { accept: 'application/json' },
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('engagement_summary_failed');
    return response.json();
  }

  async function mount() {
    addStyles();
    const items = Array.from(document.querySelectorAll('.archive-item[href]'));

    await Promise.all(items.map(async (item) => {
      const meta = item.querySelector('.archive-meta');
      if (!meta || meta.querySelector('.archive-engagement')) return;

      const content = contentKeyFromUrl(item.href);
      if (!content) return;

      try {
        const data = await getSummary(content);
        const counts = document.createElement('span');
        counts.className = 'archive-engagement';
        counts.setAttribute('aria-label', `${data.likeCount || 0} likes, ${data.commentCount || 0} comments`);
        counts.innerHTML = `<span>♡ ${data.likeCount || 0}</span><span>💬 ${data.commentCount || 0}</span>`;
        meta.appendChild(counts);
      } catch {
        // Keep the archive usable even if engagement data is temporarily unavailable.
      }
    }));
  }

  mount();
})();
