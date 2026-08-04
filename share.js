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

const isItalian = document.documentElement.lang === 'it';
const manifestoHref = isItalian ? '/manifesto.html' : '/manifesto-en.html';
const archiveHref = isItalian ? '/archivio.html' : '/archive.html';

const mainNav = document.querySelector('#main-nav');
if (mainNav) {
  const languageLink = mainNav.querySelector('.language');

  if (!mainNav.querySelector(`a[href="${archiveHref}"]`)) {
    const archiveLink = document.createElement('a');
    archiveLink.href = archiveHref;
    archiveLink.textContent = isItalian ? 'Archivio' : 'Archive';
    mainNav.insertBefore(archiveLink, languageLink || null);
  }

  if (!mainNav.querySelector(`a[href="${manifestoHref}"]`)) {
    const manifestoLink = document.createElement('a');
    manifestoLink.href = manifestoHref;
    manifestoLink.textContent = 'Manifesto';
    mainNav.insertBefore(manifestoLink, languageLink || null);
  }
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

const footerCredit = document.querySelector('footer > div > span');
if (footerCredit) {
  const logo = 'data:image/webp;base64,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';
  footerCredit.textContent = '';
  footerCredit.style.display = 'inline-flex';
  footerCredit.style.alignItems = 'center';
  footerCredit.style.gap = '12px';
  footerCredit.style.flexWrap = 'wrap';
  footerCredit.style.maxWidth = '660px';
  footerCredit.style.lineHeight = '1.45';

  const logoImage = document.createElement('img');
  logoImage.src = logo;
  logoImage.alt = 'Global Media Lab';
  logoImage.width = 110;
  logoImage.height = 100;
  logoImage.loading = 'lazy';
  logoImage.style.width = '110px';
  logoImage.style.height = 'auto';
  logoImage.style.display = 'block';
  logoImage.style.opacity = '0.92';

  const creditText = document.createElement('span');
  creditText.textContent = isItalian
    ? '© 2026 Andrea Morel · Un progetto di Global Media Lab'
    : '© 2026 Andrea Morel · A project by Global Media Lab';

  footerCredit.append(logoImage, creditText);
}
