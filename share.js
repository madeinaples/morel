const canonical = document.querySelector('link[rel="canonical"]');
const shareUrl = canonical?.href || window.location.href;
const shareTitle = document.querySelector('h1')?.textContent.trim() || document.title;

// Global Andrea Morel brand: use the final uploaded logo everywhere.
const brand = document.querySelector('.brand');
const brandImage = brand?.querySelector('img');
if (brand) {
  brand.href = '/';
  brand.setAttribute('aria-label', 'Andrea Morel — Home');
}
if (brandImage) {
  brandImage.src = '/assets/andrea-morel-logo-transparent.png?v=20260814-transparent1';
  brandImage.alt = 'Andrea Morel';
}

// Use the transparent favicon everywhere and force a fresh browser request.
let favicon = document.querySelector('link[rel="icon"]');
if (!favicon) {
  favicon = document.createElement('link');
  favicon.rel = 'icon';
  document.head.appendChild(favicon);
}
favicon.type = 'image/png';
favicon.href = '/assets/andrea-morel-favicon-transparent.png?v=20260814-final2';

if (!document.querySelector('#andrea-morel-brand-styles')) {
  const brandStyles = document.createElement('style');
  brandStyles.id = 'andrea-morel-brand-styles';
  brandStyles.textContent = `
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
      .brand {
        width: 110px !important;
        height: 110px !important;
      }
    }
  `;
  document.head.appendChild(brandStyles);
}

// Article pages use a compact header on mobile. The global mobile menu rule
// must not turn an article's simple section/language navigation into a full-screen overlay.
if (document.body.classList.contains('article-page') && !document.querySelector('#article-mobile-nav-fix')) {
  const articleMobileNavFix = document.createElement('style');
  articleMobileNavFix.id = 'article-mobile-nav-fix';
  articleMobileNavFix.textContent = `
    @media (max-width: 900px) {
      body.article-page .article-header {
        min-height: 92px;
        height: auto;
        padding: 14px 18px;
        align-items: flex-start;
      }
      body.article-page .article-header nav,
      body.article-page .article-header nav.open {
        position: static !important;
        inset: auto !important;
        z-index: auto !important;
        display: flex !important;
        width: auto !important;
        min-height: 0 !important;
        padding: 8px 0 0 !important;
        flex-direction: column !important;
        align-items: flex-end !important;
        justify-content: flex-start !important;
        gap: 8px !important;
        background: transparent !important;
      }
      body.article-page .article-header nav > a {
        font-size: 9px !important;
        line-height: 1.25 !important;
        text-align: right;
      }
      body.article-page .article-language-switch {
        display: flex !important;
        align-items: center;
        justify-content: flex-end;
        gap: 5px;
        white-space: nowrap;
        font-size: 12px;
      }
      body.article-page .article-language-switch a,
      body.article-page .article-language-switch span {
        font-size: 12px !important;
        line-height: 1.2;
      }
      body.article-page .article-main {
        position: relative;
        z-index: 1;
      }
    }
  `;
  document.head.appendChild(articleMobileNavFix);
}

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

const normalizePath = (href) => {
  try {
    return new URL(href, window.location.origin).pathname
      .replace(/\/index\.html$/, '/')
      .replace(/\.html$/, '')
      .replace(/\/$/, '');
  } catch {
    return href;
  }
};

const mainNav = document.querySelector('#main-nav');
if (mainNav) {
  const languageLink = mainNav.querySelector('.language');

  if (!mainNav.querySelector(`a[href="${archiveHref}"]`)) {
    const archiveLink = document.createElement('a');
    archiveLink.href = archiveHref;
    archiveLink.textContent = isItalian ? 'Archivio' : 'Archive';
    mainNav.insertBefore(archiveLink, languageLink || null);
  }

  const expectedManifestoPath = normalizePath(manifestoHref);
  const manifestoLinks = Array.from(mainNav.querySelectorAll('a')).filter(
    (link) => normalizePath(link.getAttribute('href') || link.href) === expectedManifestoPath
  );

  if (manifestoLinks.length === 0) {
    const manifestoLink = document.createElement('a');
    manifestoLink.href = manifestoHref;
    manifestoLink.textContent = 'Manifesto';
    mainNav.insertBefore(manifestoLink, languageLink || null);
  } else {
    manifestoLinks[0].href = manifestoHref;
    manifestoLinks[0].textContent = 'Manifesto';
    manifestoLinks.slice(1).forEach((link) => link.remove());
  }
}

const aboutCopy = document.querySelector('.about-copy');
if (aboutCopy) {
  const aboutTitle = aboutCopy.querySelector('h2');
  const bioText = aboutCopy.querySelector('.bio-text');

  if (aboutTitle) {
    aboutTitle.innerHTML = isItalian
      ? 'Una vita, molti luoghi.<br>Una casa scelta.'
      : 'One life, many places.<br>One chosen home.';
  }

  if (bioText) {
    bioText.innerHTML = isItalian
      ? `
          <p>Sono Andrea Morel. Sono italiano di nascita, ma ho sempre avuto poca simpatia per i confini quando diventano definizioni.</p>
          <p>Ho viaggiato abbastanza da sentirmi a casa in più di un luogo e straniero in molti altri. Alcuni posti si attraversano. Altri rimangono dentro: città, isole, strade, persone e culture che continuano a viaggiare con noi anche quando siamo già altrove.</p>
          <p>Ho scelto di mettere radici nel Regno Unito perché qui, con il tempo, ho riconosciuto una sensazione semplice: casa.</p>
          <p>Scrivo in italiano perché è la lingua in cui sono nato. Scrivo anche in inglese perché è una lingua capace di attraversare confini e portare una storia molto più lontano dal luogo in cui è cominciata.</p>
          <p>Non mi interessa raccontare il mondo attraverso nazionalità contrapposte. Mi interessano le persone, le città, le culture, le differenze e ciò che succede quando smettiamo di considerare il nostro modo di vivere come l’unico possibile.</p>
          <p>Ho incontrato persone improbabili, vissuto amori, errori, partenze e qualche ritorno che avrei potuto tranquillamente evitare. Scrivo di ciò che vivo, di quello che osservo e delle storie che gli altri mi affidano. Con malinconia, quando serve. Con ironia, molto più spesso. Perché la vita può essere profonda senza essere continuamente pesante.</p>
        `
      : `
          <p>I am Andrea Morel. I was born Italian, but I have never had much affection for borders when they become definitions.</p>
          <p>I have travelled enough to feel at home in more than one place and foreign in many others. Some places are simply crossed. Others stay with you: cities, islands, streets, people and cultures that keep travelling with us long after we have moved on.</p>
          <p>I chose to put down roots in the United Kingdom because, over time, I recognised a simple feeling here: home.</p>
          <p>I write in Italian because it is the language I was born into. I also write in English because it can cross borders and carry a story much further from the place where it began.</p>
          <p>I am not interested in describing the world through competing national identities. I am interested in people, cities, cultures, differences and what happens when we stop treating our own way of living as the only possible one.</p>
          <p>I have met improbable people, lived through loves, mistakes, departures and a few returns I could quite happily have avoided. I write about what I live, what I observe and the stories other people entrust to me. With melancholy, when it is needed. With irony, far more often. Because life can be profound without being relentlessly heavy.</p>
        `;
  }

  const expectedManifestoPath = normalizePath(manifestoHref);
  const aboutManifestoLinks = Array.from(aboutCopy.querySelectorAll('a')).filter(
    (link) => normalizePath(link.getAttribute('href') || link.href) === expectedManifestoPath
  );

  if (aboutManifestoLinks.length === 0) {
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
  } else {
    aboutManifestoLinks.slice(1).forEach((link) => link.remove());
  }
}

// Keep the Sweet Revenge editorial aside in the same language as the page.
const articleAside = document.querySelector('.article-aside');
if (articleAside) {
  const editorialAside = Array.from(articleAside.querySelectorAll('p')).find((p) =>
    /Music, images and pop culture as doorways|Musica, immagini e cultura pop come porte d’ingresso/i.test(p.textContent || '')
  );
  if (editorialAside) {
    editorialAside.textContent = isItalian
      ? 'Musica, immagini e cultura pop come porte d’ingresso. Non recensioni: modi diversi di guardare ciò che ci riguarda.'
      : 'Music, images and pop culture as doorways. Not reviews: different ways of looking at what concerns us.';
  }
}

const footer = document.querySelector('footer');
const footerMeta = footer?.querySelector(':scope > div');
if (footer && footerMeta) {
  footer.querySelector('.human-edit-signature')?.remove();

  const footerSpans = Array.from(footerMeta.querySelectorAll(':scope > span'));
  let footerCredit = footerSpans[0];
  if (!footerCredit) {
    footerCredit = document.createElement('span');
    footerMeta.prepend(footerCredit);
  }
  footerSpans.slice(1).forEach((span) => span.remove());

  const expectedAiPath = aiNoticeHref.replace(/\.html$/, '');
  const hasAiNoticeLink = Array.from(footerMeta.querySelectorAll('a')).some((link) => {
    const linkPath = new URL(link.href, window.location.origin).pathname
      .replace(/\.html$/, '')
      .replace(/\/$/, '');
    return linkPath === expectedAiPath;
  });

  if (!hasAiNoticeLink) {
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
  logo.width = 150;
  logo.height = 75;
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
        margin: 42px auto 28px;
        padding: 0;
        border: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        color: inherit;
        text-align: center;
        text-transform: none;
        letter-spacing: normal;
      }
      .human-edit-signature img {
        display: block;
        width: min(145px, 34vw);
        height: auto;
        margin: 0 auto;
        opacity: .76;
      }
      .human-edit-signature p {
        margin: 0;
        color: #797d79;
        font: 9px/1.4 "DM Sans", Arial, sans-serif;
        letter-spacing: .2em;
        text-align: center;
        text-transform: uppercase;
      }
      footer > .human-edit-footer-meta {
        align-items: center;
      }
      @media (max-width: 700px) {
        .human-edit-signature {
          margin: 38px auto 34px;
          gap: 10px;
        }
        .human-edit-signature img {
          width: min(122px, 32vw);
          opacity: .72;
        }
        .human-edit-signature p {
          font-size: 8px;
          letter-spacing: .18em;
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
