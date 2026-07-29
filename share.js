(() => {
  const pageUrl = window.location.href;
  const pageTitle = document.title;

  document.querySelectorAll('[data-share="facebook"]').forEach((link) => {
    link.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  document.querySelectorAll('[data-share="whatsapp"]').forEach((link) => {
    link.href = `https://wa.me/?text=${encodeURIComponent(`${pageTitle} ${pageUrl}`)}`;
  });

  document.querySelectorAll('[data-share="copy"]').forEach((button) => {
    button.addEventListener('click', async () => {
      const status = button.closest('section')?.querySelector('.copy-status');
      try {
        await navigator.clipboard.writeText(pageUrl);
        if (status) status.textContent = document.documentElement.lang === 'en' ? 'Link copied.' : 'Link copiato.';
      } catch {
        if (status) status.textContent = pageUrl;
      }
    });
  });

  const footerLinks = document.querySelector('footer div');
  if (footerLinks && !footerLinks.querySelector('a[href="/legal.html"]')) {
    const legal = document.createElement('a');
    legal.href = '/legal.html';
    legal.textContent = document.documentElement.lang === 'en' ? 'Privacy & Legal' : 'Privacy e note legali';
    footerLinks.appendChild(legal);
  }
})();