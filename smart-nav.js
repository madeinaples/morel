/* Responsive navigation for standalone editorial hubs. */
(() => {
 const button = document.querySelector('.menu-button');
 const nav = document.querySelector('#main-nav.smart-nav');
 if (!button || !nav) return;
 const close = restoreFocus => {
   nav.classList.remove('open');
   button.setAttribute('aria-expanded', 'false');
   document.body.classList.remove('nav-open');
   if (restoreFocus) button.focus();
 };
 button.addEventListener('click', () => {
   const opened = nav.classList.toggle('open');
   button.setAttribute('aria-expanded', String(opened));
   document.body.classList.toggle('nav-open', opened);
 });
 nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => close(false)));
 document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) close(true); });
 window.addEventListener('resize', () => { if (window.innerWidth > 900 && nav.classList.contains('open')) close(false); });
})();
