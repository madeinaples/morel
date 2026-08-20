(() => {
  if (window.__morelThreadEngineMounted) return;
  window.__morelThreadEngineMounted = true;

  const normalizePath = (value) => {
    try {
      const url = new URL(value, window.location.origin);
      return url.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/$/, '') || '/';
    } catch {
      return value;
    }
  };

  const routes = {
    '/storie/dove-guardano-gli-uomini-all-orinatoio': {
      lang: 'it',
      question: 'Forse non ci preoccupa davvero dove guardano gli altri. Ci preoccupa quello che immaginiamo stiano pensando mentre lo fanno.',
      next: '/storie/il-corpo-non-e-un-curriculum.html',
      archive: '/archivio.html',
      label: 'Continua il pensiero',
      cta: 'Continua',
      archiveLabel: 'Archivio'
    },
    '/stories/where-do-men-look-at-the-urinal': {
      lang: 'en',
      question: "Maybe we're not really worried about where other people are looking. We're worried about what we imagine they're thinking when they do.",
      next: '/stories/the-body-is-not-a-cv.html',
      archive: '/archive.html',
      label: 'Continue the thought',
      cta: 'Continue',
      archiveLabel: 'Archive'
    },
    '/storie/il-corpo-non-e-un-curriculum': {
      lang: 'it',
      question: 'Se pensiamo continuamente a quello che gli altri vedono, prima o poi impariamo a mostrare quello che vogliono vedere. Ma essere scelti significa essere desiderati?',
      next: '/storie/ti-mando-il-mio-paypal.html',
      archive: '/archivio.html',
      label: 'Continua il pensiero',
      cta: 'Continua',
      archiveLabel: 'Archivio'
    },
    '/stories/the-body-is-not-a-cv': {
      lang: 'en',
      question: 'If we keep thinking about what other people see, sooner or later we learn to show them what they want to see. But does being chosen mean being desired?',
      next: '/stories/ill-send-you-my-paypal.html',
      archive: '/archive.html',
      label: 'Continue the thought',
      cta: 'Continue',
      archiveLabel: 'Archive'
    },
    '/storie/ti-mando-il-mio-paypal': {
      lang: 'it',
      question: 'Essere desiderati può farci sentire vivi. Ma quanto di me hai realmente incontrato?',
      next: '/storie/dietro-il-muro.html',
      archive: '/archivio.html',
      label: 'Continua il pensiero',
      cta: 'Continua',
      archiveLabel: 'Archivio'
    },
    '/stories/ill-send-you-my-paypal': {
      lang: 'en',
      question: 'Being desired can make us feel alive. But how much of me have you actually met?',
      next: '/stories/behind-the-wall.html',
      archive: '/archive.html',
      label: 'Continue the thought',
      cta: 'Continue',
      archiveLabel: 'Archive'
    }
  };

  const path = normalizePath(window.location.pathname);
  const route = routes[path];
  if (!route || !document.body.classList.contains('article-page')) return;

  if (!document.querySelector('#morel-thread-engine-styles')) {
    const style = document.createElement('style');
    style.id = 'morel-thread-engine-styles';
    style.textContent = `
      .morel-thread-door {
        margin: clamp(72px, 10vw, 140px) 0 20px;
        padding: clamp(30px, 5vw, 58px) 0 10px;
        border-top: 1px solid rgba(238, 233, 222, .2);
      }
      .morel-thread-door__label {
        margin: 0 0 22px;
        color: #9b9d97;
        font: 10px/1.4 "DM Sans", Arial, sans-serif;
        letter-spacing: .22em;
        text-transform: uppercase;
      }
      .morel-thread-door__question {
        max-width: 760px;
        margin: 0;
        color: #eee9de;
        font: clamp(30px, 4.2vw, 58px)/1.08 "Newsreader", Georgia, serif;
        letter-spacing: -.025em;
      }
      .morel-thread-door__actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 18px 28px;
        margin-top: 34px;
      }
      .morel-thread-door__continue {
        display: inline-flex;
        align-items: center;
        gap: 24px;
        min-height: 48px;
        padding: 13px 18px;
        border: 1px solid rgba(238, 233, 222, .42);
        background: #eee9de;
        color: #090b0b;
        text-decoration: none;
        font: 10px/1 "DM Sans", Arial, sans-serif;
        letter-spacing: .16em;
        text-transform: uppercase;
        transition: transform .2s ease, background .2s ease;
      }
      .morel-thread-door__continue:hover,
      .morel-thread-door__continue:focus-visible {
        transform: translateY(-2px);
        background: #d9d3c8;
      }
      .morel-thread-door__archive {
        color: #9b9d97;
        text-decoration: none;
        font: 10px/1.4 "DM Sans", Arial, sans-serif;
        letter-spacing: .14em;
        text-transform: uppercase;
      }
      .morel-thread-door__archive:hover,
      .morel-thread-door__archive:focus-visible { color: #eee9de; }
      .morel-thread-door + .article-end { display: none !important; }
      @media (max-width: 700px) {
        .morel-thread-door { margin-top: 64px; padding-top: 28px; }
        .morel-thread-door__question { font-size: clamp(30px, 9vw, 44px); }
      }
    `;
    document.head.appendChild(style);
  }

  const oldEnd = document.querySelector('.article-body .article-end');
  if (!oldEnd) return;

  const door = document.createElement('section');
  door.className = 'morel-thread-door';
  door.setAttribute('aria-label', route.label);
  door.innerHTML = `
    <p class="morel-thread-door__label">${route.label}</p>
    <p class="morel-thread-door__question">${route.question}</p>
    <div class="morel-thread-door__actions">
      <a class="morel-thread-door__continue" href="${route.next}" data-morel-thread-continue>${route.cta} <span aria-hidden="true">→</span></a>
      <a class="morel-thread-door__archive" href="${route.archive}">${route.archiveLabel}</a>
    </div>
  `;

  oldEnd.insertAdjacentElement('beforebegin', door);

  const emit = (name, detail = {}) => {
    window.dispatchEvent(new CustomEvent(name, { detail }));
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, detail);
    }
  };

  emit('morel_bridge_exposed', { from: path, to: normalizePath(route.next), lang: route.lang });

  door.querySelector('[data-morel-thread-continue]')?.addEventListener('click', () => {
    emit('morel_bridge_opened', { from: path, to: normalizePath(route.next), lang: route.lang });
  });
})();
