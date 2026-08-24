(() => {
  'use strict';

  const HES_URL = 'https://humaneditstudio.co.uk/';

  const ensureFooterStyles = () => {
    if (!document.querySelector('link[href^="/footer-refine.css"], link[href*="footer-refine.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/footer-refine.css?v=3';
      document.head.appendChild(link);
    }

    if (!document.querySelector('#hes-universal-footer-styles')) {
      const style = document.createElement('style');
      style.id = 'hes-universal-footer-styles';
      style.textContent = `
        footer {
          position: relative;
        }
        footer .human-edit-signature {
          flex: 0 0 190px;
          width: 190px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-align: center;
          text-decoration: none;
          color: inherit;
        }
        footer .human-edit-signature img {
          display: block;
          width: 112px;
          height: auto;
          margin: 0 auto;
          opacity: .82;
        }
        footer .human-edit-signature p {
          margin: 0;
          color: #797d79;
          font: 8px/1.4 "DM Sans", Arial, sans-serif;
          letter-spacing: .20em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        footer > div > span:first-child {
          min-width: 250px;
          max-width: 390px;
          line-height: 1.55;
        }
        footer > div > span:first-child a {
          color: inherit;
          text-decoration: none;
          border-bottom: 1px solid rgba(238,233,222,.25);
        }
        footer > div > span:first-child a:hover,
        footer > div > span:first-child a:focus-visible {
          border-bottom-color: currentColor;
        }
        @media (max-width: 980px) {
          footer .human-edit-signature {
            flex-basis: 160px;
            width: 160px;
          }
          footer .human-edit-signature img { width: 104px; }
          footer > div > span:first-child { min-width: 220px; }
        }
        @media (max-width: 760px) {
          footer .human-edit-signature {
            order: 2;
            width: 100%;
            flex-basis: auto;
            margin: 8px 0 4px;
          }
          footer .human-edit-signature img { width: 108px; }
          footer .human-edit-signature p {
            white-space: normal;
            font-size: 8px;
          }
          footer > div > span:first-child {
            min-width: 0;
            max-width: none;
            width: 100%;
          }
        }
      `;
      document.head.appendChild(style);
    }
  };

  const ensureMetaLink = (footerMeta, href, label, before = null) => {
    const normalized = href.replace(/\/$/, '');
    const existing = Array.from(footerMeta.querySelectorAll(':scope > a')).find((a) => {
      try {
        return new URL(a.href, window.location.origin).href.replace(/\/$/, '') === new URL(href, window.location.origin).href.replace(/\/$/, '');
      } catch {
        return false;
      }
    });
    if (existing) {
      existing.textContent = label;
      return existing;
    }
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    if (/^https?:/i.test(href)) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    footerMeta.insertBefore(a, before);
    return a;
  };

  const applyHesFooterFix = () => {
    const footer = document.querySelector('footer');
    const footerMeta = footer?.querySelector(':scope > div');
    if (!footer || !footerMeta) return;

    ensureFooterStyles();

    footerMeta.querySelectorAll('.hes-credit').forEach((el) => el.remove());

    let signature = footer.querySelector('.human-edit-signature');
    if (signature && signature.tagName !== 'A') {
      const link = document.createElement('a');
      link.className = signature.className;
      while (signature.firstChild) link.appendChild(signature.firstChild);
      signature.replaceWith(link);
      signature = link;
    }

    if (!signature) {
      signature = document.createElement('a');
      signature.className = 'human-edit-signature';
      signature.innerHTML = '<img src="/assets/human-edit-studio-white.svg" alt="Human Edit Studio" width="150" height="75" loading="lazy"><p>Websites. Content. Care.</p>';
      footer.insertBefore(signature, footerMeta);
    }

    signature.href = HES_URL;
    signature.target = '_blank';
    signature.rel = 'noopener noreferrer';
    signature.setAttribute('aria-label', 'Human Edit Studio');

    const isItalian = document.documentElement.lang.toLowerCase().startsWith('it');
    let credit = footerMeta.querySelector(':scope > span');
    if (!credit) {
      credit = document.createElement('span');
      footerMeta.prepend(credit);
    }
    footerMeta.querySelectorAll(':scope > span').forEach((span, index) => {
      if (index > 0) span.remove();
    });

    credit.innerHTML = isItalian
      ? '© 2026 Andrea Morel · Un progetto di <a href="https://humaneditstudio.co.uk/" target="_blank" rel="noopener noreferrer">Human Edit Studio</a>'
      : '© 2026 Andrea Morel · A project by <a href="https://humaneditstudio.co.uk/" target="_blank" rel="noopener noreferrer">Human Edit Studio</a>';

    const privacyHref = isItalian ? '/privacy.html' : '/privacy-en.html';
    const aiHref = isItalian ? '/nota-ai.html' : '/ai-use-notice.html';
    const instagramHref = 'https://www.instagram.com/andreamorel.writer/';
    const emailHref = 'mailto:andreamoreluk@gmail.com';

    const existingTopLinks = Array.from(footerMeta.querySelectorAll(':scope > a'));
    const privacy = ensureMetaLink(footerMeta, privacyHref, 'Privacy');
    ensureMetaLink(footerMeta, aiHref, isItalian ? 'Uso dell’AI' : 'AI use');
    ensureMetaLink(footerMeta, instagramHref, 'Instagram');
    ensureMetaLink(footerMeta, emailHref, 'Email');

    existingTopLinks.forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (!href) return;
      const keep = [privacyHref, aiHref, instagramHref, emailHref].some((target) => {
        try {
          return new URL(href, window.location.origin).href.replace(/\/$/, '') === new URL(target, window.location.origin).href.replace(/\/$/, '');
        } catch {
          return false;
        }
      });
      if (!keep) a.remove();
    });

    footerMeta.classList.add('human-edit-footer-meta');
    if (privacy && privacy.parentElement !== footerMeta) footerMeta.appendChild(privacy);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyHesFooterFix, { once: true });
  } else {
    applyHesFooterFix();
  }
})();
