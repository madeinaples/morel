const afterReadingAbout = document.querySelector('section.about');
const afterReadingItalian = document.documentElement.lang === 'it';

if (afterReadingAbout && !document.querySelector('.after-reading-home')) {
  const section = document.createElement('section');
  section.className = 'after-reading-home';
  const href = afterReadingItalian ? '/dopo-la-lettura.html' : '/after-reading.html';
  section.innerHTML = afterReadingItalian
    ? `<div class="after-reading-intro"><p class="kicker">Dopo la lettura</p><h2>Le storie fanno pensare.<br>Poi, però, bisogna anche mangiare.</h2><p>Ricette semplici, vino e altre soluzioni concrete. Senza trasformare la cena in un progetto europeo.</p></div><div class="after-reading-grid"><a href="${href}" class="after-reading-card"><span>01 · Se ti è venuta fame</span><h3>Spaghetti aglio, olio e peperoncino</h3><p>Quindici minuti, pochi ingredienti e nessun posto dove nascondere gli errori.</p><b>Vai in cucina ↗</b></a><div class="after-reading-card"><span>02 · Nel bicchiere</span><h3>Fiano di Avellino</h3><p>Fresco, non congelato. Abbastanza elegante da far sembrare la serata organizzata.</p></div><div class="after-reading-card"><span>03 · Il consiglio di Andrea</span><h3>Invita qualcuno</h3><p>Se la conversazione funziona, avrai fatto una bella figura. Se non funziona, almeno avrai mangiato bene.</p></div></div>`
    : `<div class="after-reading-intro"><p class="kicker">After Reading</p><h2>Stories make you think.<br>Then, eventually, you also have to eat.</h2><p>Simple recipes, wine and other practical solutions. Without turning dinner into a European project.</p></div><div class="after-reading-grid"><a href="${href}" class="after-reading-card"><span>01 · If you are hungry</span><h3>Spaghetti with garlic, olive oil and chilli</h3><p>Fifteen minutes, very few ingredients and nowhere to hide your mistakes.</p><b>Go to the kitchen ↗</b></a><div class="after-reading-card"><span>02 · In the glass</span><h3>Fiano di Avellino</h3><p>Chilled, not frozen. Elegant enough to make the evening look organised.</p></div><div class="after-reading-card"><span>03 · Andrea’s advice</span><h3>Invite someone</h3><p>If the conversation works, you will have made an excellent impression. If not, at least you will have eaten well.</p></div></div>`;
  afterReadingAbout.parentNode.insertBefore(section, afterReadingAbout);

  const style = document.createElement('style');
  style.textContent = `
    .after-reading-home { padding: 110px 4vw 125px; background: #ddd6ca; color: #171817; }
    .after-reading-intro { width: min(1000px, 90vw); margin: 0 auto 65px; }
    .after-reading-intro .kicker { color: #7f432f; }
    .after-reading-intro h2 { margin: 24px 0 28px; font: clamp(54px, 7.5vw, 112px)/.88 "Libre Caslon Display", Georgia, serif; letter-spacing: -.055em; }
    .after-reading-intro > p:last-child { max-width: 720px; font: 22px/1.5 "Newsreader", Georgia, serif; }
    .after-reading-grid { width: min(1180px, 92vw); margin: 0 auto; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); border: 1px solid rgba(23,24,23,.2); }
    .after-reading-card { min-height: 390px; padding: 34px; display: flex; flex-direction: column; color: inherit; text-decoration: none; border-right: 1px solid rgba(23,24,23,.2); background: rgba(255,255,255,.16); }
    .after-reading-card:last-child { border-right: 0; }
    .after-reading-card span { font: 10px/1.5 "DM Sans",Arial,sans-serif; letter-spacing: .17em; text-transform: uppercase; color: #6c6b66; }
    .after-reading-card h3 { margin: auto 0 22px; font: clamp(34px,3.5vw,54px)/.95 "Libre Caslon Display",Georgia,serif; letter-spacing: -.04em; }
    .after-reading-card p { margin: 0 0 30px; font: 19px/1.45 "Newsreader",Georgia,serif; }
    .after-reading-card b { margin-top: auto; font: 10px "DM Sans",Arial,sans-serif; letter-spacing: .16em; text-transform: uppercase; }
    @media (max-width: 800px) { .after-reading-grid { grid-template-columns: 1fr; } .after-reading-card { min-height: 330px; border-right: 0; border-bottom: 1px solid rgba(23,24,23,.2); } .after-reading-card:last-child { border-bottom: 0; } }
  `;
  document.head.appendChild(style);
}