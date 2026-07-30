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

// Keep the editorial manifesto visible without overloading the homepage markup.
const isItalian = document.documentElement.lang === 'it';
const manifestoHref = isItalian ? '/manifesto.html' : '/manifesto-en.html';
const manifestoLabel = isItalian ? 'Manifesto' : 'Manifesto';

const mainNav = document.querySelector('#main-nav');
if (mainNav && !mainNav.querySelector(`a[href="${manifestoHref}"]`)) {
  const manifestoLink = document.createElement('a');
  manifestoLink.href = manifestoHref;
  manifestoLink.textContent = manifestoLabel;
  const languageLink = mainNav.querySelector('.language');
  mainNav.insertBefore(manifestoLink, languageLink || null);
}

const aboutCopy = document.querySelector('.about-copy');
if (aboutCopy && !aboutCopy.querySelector(`a[href="${manifestoHref}"]`)) {
  const manifestoIntro = document.createElement('p');
  manifestoIntro.className = 'manifesto-intro';
  manifestoIntro.textContent = isItalian
    ? 'Andrea Morel non racconta una categoria. Racconta esseri umani, memoria e libertà conquistata.'
    : 'Andrea Morel does not tell the story of a category. He writes about human beings, memory and hard-won freedom.';

  const manifestoLink = document.createElement('a');
  manifestoLink.href = manifestoHref;
  manifestoLink.innerHTML = isItalian
    ? 'Leggi il manifesto editoriale <span>↗</span>'
    : 'Read the editorial manifesto <span>↗</span>';

  const emailLink = aboutCopy.querySelector('a[href^="mailto:"]');
  aboutCopy.insertBefore(manifestoIntro, emailLink || null);
  aboutCopy.insertBefore(manifestoLink, emailLink || null);
}