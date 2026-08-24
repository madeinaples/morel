(() => {
  const applyHesFooterFix = () => {
    const footer = document.querySelector('footer');
    const footerMeta = footer?.querySelector(':scope > div');
    if (!footer || !footerMeta) return;

    footerMeta.querySelectorAll('.hes-credit').forEach((el) => el.remove());

    const signature = footer.querySelector('.human-edit-signature');
    if (signature && signature.tagName !== 'A') {
      const link = document.createElement('a');
      link.className = signature.className;
      link.href = 'https://humaneditstudio.co.uk/';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', 'Human Edit Studio');
      while (signature.firstChild) link.appendChild(signature.firstChild);
      signature.replaceWith(link);
    } else if (signature) {
      signature.href = 'https://humaneditstudio.co.uk/';
      signature.target = '_blank';
      signature.rel = 'noopener noreferrer';
    }

    const credit = footerMeta.querySelector(':scope > span');
    if (credit) {
      const isItalian = document.documentElement.lang === 'it';
      credit.innerHTML = isItalian
        ? '© 2026 Andrea Morel · Un progetto di <a href="https://humaneditstudio.co.uk/" target="_blank" rel="noopener noreferrer">Human Edit Studio</a>'
        : '© 2026 Andrea Morel · A project by <a href="https://humaneditstudio.co.uk/" target="_blank" rel="noopener noreferrer">Human Edit Studio</a>';
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyHesFooterFix, { once: true });
  } else {
    applyHesFooterFix();
  }
})();
