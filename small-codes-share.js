(() => {
  if (!window.location.pathname.startsWith('/small-codes/')) return;

  const canonical = document.querySelector('link[rel="canonical"]')?.href || window.location.href;
  const title = document.querySelector('h1')?.textContent.replace(/\s+/g, ' ').trim() || document.title;
  const isItalian = document.documentElement.lang === 'it';
  const host = document.querySelector('.code-body, main article.capri-copy');
  if (!host || document.querySelector('.small-code-share')) return;

  const style = document.createElement('style');
  style.textContent = `
    .small-code-share{max-width:720px;margin:64px 0 10px;padding-top:28px;border-top:1px solid rgba(238,233,222,.14);font-family:"DM Sans",Arial,sans-serif}
    .small-code-share-title{margin:0 0 15px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;opacity:.58}
    .small-code-share-links{display:flex;flex-wrap:wrap;gap:8px}
    .small-code-share a,.small-code-share button{appearance:none;border:1px solid rgba(238,233,222,.18);background:transparent;color:inherit;border-radius:999px;padding:9px 12px;text-decoration:none;cursor:pointer;font:400 11px/1 "DM Sans",Arial,sans-serif}
    .small-code-share a:hover,.small-code-share button:hover{border-color:rgba(238,233,222,.48)}
    .small-code-share-status{min-height:15px;margin:10px 0 0;font-size:10px;opacity:.62}
  `;
  document.head.appendChild(style);

  const box = document.createElement('section');
  box.className = 'small-code-share';
  box.setAttribute('aria-label', isItalian ? 'Condividi questo articolo' : 'Share this article');
  box.innerHTML = `
    <p class="small-code-share-title">${isItalian ? 'POST / CONDIVIDI' : 'POST / SHARE'}</p>
    <div class="small-code-share-links">
      <a data-network="whatsapp" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      <a data-network="facebook" target="_blank" rel="noopener noreferrer">Facebook</a>
      <a data-network="x" target="_blank" rel="noopener noreferrer">X</a>
      <a data-network="linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a data-network="telegram" target="_blank" rel="noopener noreferrer">Telegram</a>
      <a data-network="email">Email</a>
      <button type="button" data-network="copy">${isItalian ? 'Copia link' : 'Copy link'}</button>
    </div>
    <p class="small-code-share-status" aria-live="polite"></p>`;

  host.appendChild(box);
  const encodedUrl = encodeURIComponent(canonical);
  const encodedTitle = encodeURIComponent(title);
  box.querySelector('[data-network="whatsapp"]').href = `https://wa.me/?text=${encodeURIComponent(`${title} — ${canonical}`)}`;
  box.querySelector('[data-network="facebook"]').href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  box.querySelector('[data-network="x"]').href = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  box.querySelector('[data-network="linkedin"]').href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  box.querySelector('[data-network="telegram"]').href = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
  box.querySelector('[data-network="email"]').href = `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`${title}\n\n${canonical}`)}`;

  box.querySelector('[data-network="copy"]').addEventListener('click', async () => {
    const status = box.querySelector('.small-code-share-status');
    try {
      await navigator.clipboard.writeText(canonical);
      status.textContent = isItalian ? 'Link copiato.' : 'Link copied.';
    } catch {
      status.textContent = canonical;
    }
  });
})();
