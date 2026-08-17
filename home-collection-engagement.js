(() => {
  if (!document.body.classList.contains('home-v2')) return;

  const API = '/.netlify/functions/engagement';

  const contentKeyFromUrl = (url) => {
    try {
      const path = new URL(url, window.location.origin).pathname;
      return path.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/$/, '') || '/';
    } catch {
      return '/';
    }
  };

  const getSummary = async (content) => {
    const response = await fetch(`${API}?content=${encodeURIComponent(content)}&summary=1`, {
      headers: { accept: 'application/json' },
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('summary_failed');
    return response.json();
  };

  async function getCollectionTotals(collectionUrl) {
    const response = await fetch(collectionUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error('collection_failed');
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const articleLinks = Array.from(doc.querySelectorAll('.article-list a.article-teaser[href]'));
    const keys = [...new Set(articleLinks.map((link) => contentKeyFromUrl(link.href)))];
    if (!keys.length) return { likeCount: 0, commentCount: 0 };

    const rows = await Promise.all(keys.map((key) => getSummary(key).catch(() => ({ likeCount: 0, commentCount: 0 }))));
    return rows.reduce((total, row) => ({
      likeCount: total.likeCount + Number(row.likeCount || 0),
      commentCount: total.commentCount + Number(row.commentCount || 0)
    }), { likeCount: 0, commentCount: 0 });
  }

  function renderCounts(card, totals) {
    let counts = card.querySelector('.morel-inline-counts[data-collection-total="1"]');
    const existing = card.querySelector('.morel-inline-counts:not([data-collection-total="1"])');
    if (existing) existing.remove();

    if (!counts) {
      counts = document.createElement('span');
      counts.className = 'morel-inline-counts';
      counts.dataset.collectionTotal = '1';
      const link = card.querySelector('.read-link');
      if (link) link.insertAdjacentElement('afterend', counts);
      else card.appendChild(counts);
    }
    counts.innerHTML = `<span>♡ ${totals.likeCount}</span><span>💬 ${totals.commentCount}</span>`;
  }

  async function mount() {
    const cards = Array.from(document.querySelectorAll('.collection-card'));
    await Promise.all(cards.map(async (card) => {
      const link = card.querySelector('.read-link[href]');
      if (!link) return;
      try {
        const totals = await getCollectionTotals(link.href);
        renderCounts(card, totals);
      } catch {
        // Keep the homepage usable if one collection cannot be read temporarily.
      }
    }));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(mount, 250), { once: true });
  } else {
    setTimeout(mount, 250);
  }
})();
