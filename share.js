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
const aiNoticeHref = isItalian ? '/nota-ai.html' : '/ai-use-notice.html';

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

const footer = document.querySelector('footer');
const footerMeta = footer?.querySelector(':scope > div');
const footerCredit = footerMeta?.querySelector(':scope > span');
if (footer && footerMeta && footerCredit) {
  footer.querySelector('.human-edit-signature')?.remove();

  if (!footerMeta.querySelector(`a[href="${aiNoticeHref}"]`)) {
    const aiLink = document.createElement('a');
    aiLink.href = aiNoticeHref;
    aiLink.textContent = isItalian ? 'Uso dell’AI' : 'AI use';
    const instagramLink = footerMeta.querySelector('a[href*="instagram.com"]');
    footerMeta.insertBefore(aiLink, instagramLink || null);
  }

  const signature = document.createElement('div');
  signature.className = 'human-edit-signature';

  const logo = document.createElement('img');
  logo.src = '/assets/human-edit-studio-white.svg';
  logo.alt = 'Human Edit Studio';
  logo.width = 220;
  logo.height = 110;
  logo.loading = 'lazy';

  const tagline = document.createElement('p');
  tagline.textContent = 'Websites. Content. Care.';

  signature.append(logo, tagline);
  footer.insertBefore(signature, footerMeta);

  footerMeta.classList.add('human-edit-footer-meta');
  footerCredit.textContent = isItalian
    ? '© 2026 Andrea Morel · Un progetto di Human Edit Studio'
    : '© 2026 Andrea Morel · A project by Human Edit Studio';

  if (!document.querySelector('#human-edit-footer-styles')) {
    const style = document.createElement('style');
    style.id = 'human-edit-footer-styles';
    style.textContent = `
      .human-edit-signature {
        width: 100%;
        margin: 64px auto 34px;
        padding: 0;
        border: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 18px;
        color: inherit;
        text-align: center;
        text-transform: none;
        letter-spacing: normal;
      }
      .human-edit-signature img {
        display: block;
        width: min(210px, 52vw);
        height: auto;
        margin: 0 auto;
        opacity: .94;
      }
      .human-edit-signature p {
        margin: 0;
        color: #9b9d97;
        font: 10px/1.4 "DM Sans", Arial, sans-serif;
        letter-spacing: .22em;
        text-align: center;
        text-transform: uppercase;
      }
      footer > .human-edit-footer-meta {
        align-items: center;
      }
      @media (max-width: 700px) {
        .human-edit-signature {
          margin: 54px auto 42px;
          gap: 20px;
        }
        .human-edit-signature img {
          width: min(190px, 56vw);
        }
        footer > .human-edit-footer-meta {
          display: grid;
          grid-template-columns: repeat(2, auto);
          justify-content: center;
          gap: 18px 28px;
          text-align: center;
        }
        footer > .human-edit-footer-meta > span {
          grid-column: 1 / -1;
          width: 100%;
          margin: 0;
          line-height: 1.7;
          text-align: center;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

if (document.querySelector('section.about')) {
  const afterReadingScript = document.createElement('script');
  afterReadingScript.src = '/after-reading-home.js';
  afterReadingScript.defer = true;
  document.body.appendChild(afterReadingScript);
}
