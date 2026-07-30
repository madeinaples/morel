const canonical = document.querySelector('link[rel="canonical"]');
const shareUrl = canonical?.href || window.location.href;
const shareTitle = document.querySelector('h1')?.textContent.trim() || document.title;

document.querySelector('[data-share="facebook"]')?.addEventListener('click', (event) => {
  event.preventDefault();
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  window.open(url, 'facebook-share', 'width=680,height=720,noopener,noreferrer');
});

const whatsapp = document.querySelector('[data-share="whatsapp"]');
if (whatsapp) {
  whatsapp.href = `https://wa.me/?text=${encodeURIComponent(`${shareTitle} — ${shareUrl}`)}`;
}

document.querySelector('[data-share="copy"]')?.addEventListener('click', async () => {
  const status = document.querySelector('.copy-status');
  try {
    await navigator.clipboard.writeText(shareUrl);
    status.textContent = document.documentElement.lang === 'it' ? 'Link copiato.' : 'Link copied.';
  } catch {
    const input = document.createElement('textarea');
    input.value = shareUrl;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
    status.textContent = document.documentElement.lang === 'it' ? 'Link copiato.' : 'Link copied.';
  }
});
