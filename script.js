const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#main-nav');

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', open);
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }
}), { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const stories = {
  zero: {
    tag: 'Puntata zero · Diario di sopravvivenza',
    title: 'Le cose che restano accese',
    intro: 'Londra, dopo la pioggia, sembra sempre sapere qualcosa che non vuole raccontare.',
    body: [
      `I marciapiedi riflettono le finestre, i lampioni e le persone che camminano in fretta fingendo di avere una destinazione precisa. Sono quasi le undici. Dall’altra parte della strada, un uomo aspetta davanti a una porta blu.`,
      `Controlla il telefono. Lo rimette in tasca. Dopo pochi secondi lo controlla di nuovo.`,
      `Forse qualcuno gli ha scritto che sta arrivando.`,
      `Forse nessuno gli ha scritto niente.`,
      `A una certa età impari che le due cose possono avere esattamente la stessa espressione.`,
      `Io lo osservo dalla finestra con una tazza ormai fredda tra le mani. Non è curiosità. O almeno, non soltanto. Mi interessano le persone quando credono che nessuno le stia guardando. È in quel momento che smettono di recitare.`,
      `Il mio telefono si illumina sul tavolo.`,
      `Are you still awake?`,
      `Il messaggio arriva da un uomo che non sento da quasi tre mesi. Uno di quelli che scompaiono senza litigare, senza salutare e soprattutto senza morire. Quest’ultima è la parte più irritante: non puoi nemmeno idealizzarli.`,
      `Rileggo la domanda.`,
      `Non chiede come sto. Non dice che gli sono mancato. Vuole sapere soltanto se sono ancora sveglio.`,
      `Lo sono.`,
      `Ma non rispondo.`,
      `Essere disponibili e farsi trovare disponibili non sono la stessa cosa. È una distinzione che ho imparato tardi, insieme all’importanza di una buona crema per il viso e alla completa inutilità di discutere con un uomo che risponde soltanto con emoji.`,
      `Torno a guardare fuori.`,
      `L’uomo davanti alla porta blu si è acceso una sigaretta. La protegge dalla pioggia con una mano. Ha superato i cinquanta, forse da poco. Porta un cappotto troppo leggero per la stagione e conserva ancora quella postura particolare di chi spera di essere desiderato senza voler sembrare in attesa.`,
      `Conosco quella postura.`,
      `L’abbiamo avuta tutti.`,
      `La abbiamo quando controlliamo se qualcuno ha visualizzato un messaggio. Quando diciamo che una relazione “non era niente di serio”, anche se per settimane abbiamo immaginato dove mettere il suo spazzolino. Quando ci convinciamo che la solitudine sia una scelta, perché l’alternativa sarebbe ammettere che alcune sere non lo è affatto.`,
      `Il telefono si illumina ancora.`,
      `I was thinking about you.`,
      `Ecco.`,
      `La frase che riapre tutte le porte che avevamo chiuso con grande dignità e pessima falegnameria.`,
      `Potrei rispondere.`,
      `Potrei fingermi distaccato. Potrei scrivere qualcosa di breve, elegante e vagamente crudele. Ho abbastanza esperienza per sapere quali parole usare e abbastanza vanità per desiderare che facciano effetto.`,
      `Invece appoggio il telefono con lo schermo rivolto verso il tavolo.`,
      `Non perché io sia diventato improvvisamente saggio.`,
      `Sono ancora romantico, contro ogni prova disponibile.`,
      `Ma questa sera preferisco osservare l’uomo dall’altra parte della strada.`,
      `La porta blu finalmente si apre. Compare un altro uomo. Non si abbracciano subito. Rimangono immobili per un istante, separati da pochi centimetri e da tutto quello che non si sono ancora detti.`,
      `Poi uno dei due sorride.`,
      `È un sorriso piccolo, quasi prudente.`,
      `L’altro abbassa lo sguardo.`,
      `La porta si chiude dietro di loro.`,
      `Resto davanti alla finestra ancora qualche minuto. La strada è di nuovo vuota, ma una luce si accende al piano superiore della casa.`,
      `Forse si ameranno.`,
      `Forse passeranno soltanto la notte insieme.`,
      `Forse domani uno dei due dirà di non essere pronto per qualcosa di serio, come se l’amore fosse un appartamento ancora in costruzione.`,
      `Non posso saperlo.`,
      `Ed è proprio questo che mi interessa.`,
      `Quello che accade tra il desiderio e la paura. Tra un messaggio scritto e uno cancellato. Tra il corpo che invecchia e il bisogno, ostinato e quasi comico, di essere ancora scelti.`,
      `Scrivo delle persone che aspettano davanti alle porte.`,
      `Di quelle che restano dietro una finestra.`,
      `Degli uomini che spariscono e poi domandano se siamo ancora svegli.`,
      `Scrivo della solitudine, ma non come una malattia. Del desiderio, ma senza fingere che sia sempre romantico. Dell’età, del sesso, delle occasioni perdute e di quelle che forse era meglio perdere.`,
      `Scrivo di ciò che mostriamo.`,
      `E soprattutto di quello che cerchiamo di nascondere.`,
      `Il telefono non si illumina più.`,
      `Per un istante provo qualcosa che potrebbe essere tristezza.`,
      `O sollievo.`,
      `A una certa età impari che anche queste due cose possono avere esattamente la stessa espressione.`,
      `Fuori ricomincia a piovere.`,
      `Al piano superiore della casa con la porta blu, la luce rimane accesa.`,
    ],
  },
  stanze: {
    tag: 'Sezione 01 · Prima persona',
    title: 'Storie di Andrea',
    intro: 'Qui la distanza tra chi scrive e ciò che viene raccontato scompare.',
    body: [
      `Storie di Andrea raccoglie le pagine che nascono dalla mia esperienza: memoria, relazioni, solitudine, desiderio, corpo, età e cambiamento.`,
      `Non è un diario ordinato e non pretende di offrire risposte. È il luogo in cui provo a dare un nome alle cose mentre stanno ancora accadendo, anche quando il nome non è comodo.`,
      `La voce è in prima persona. Il materiale è personale. La scrittura, però, cerca sempre quel punto in cui un’esperienza individuale può diventare riconoscibile anche per qualcun altro.`,
    ],
  },
  osservate: {
    tag: 'Sezione 02 · Idee e riflessioni',
    title: 'Pensieri senza filtro',
    intro: 'Le domande che restano quando smettiamo di addolcire le risposte.',
    body: [
      `Qui osservo Londra e il presente: l’ultimo autobus, le persone ferme davanti a uno schermo, i nuovi linguaggi del desiderio, il modo in cui tecnologia, denaro e solitudine cambiano le nostre giornate.`,
      `Sono note, brevi saggi e frammenti di viaggio. Non parlano necessariamente di me, ma portano il mio punto di vista: curioso, partecipe e talvolta ironico.`,
      `Niente cartoline turistiche. Mi interessano la città reale, le contraddizioni di oggi e quei piccoli gesti che, senza saperlo, documentano un’epoca.`,
    ],
  },
  passaggio: {
    tag: 'Sezione 03 · Terza persona',
    title: 'Storie degli altri',
    intro: 'Le persone ci affidano storie che continuano a vivere anche dopo che ci siamo salutati.',
    body: [
      `Questa sezione ospita vite diverse dalla mia: incontri, confidenze, racconti ascoltati e personaggi ispirati alla realtà, osservati da una distanza esterna.`,
      `Quando una storia nasce da fatti veri, nomi, luoghi e dettagli riconoscibili vengono trasformati. La fedeltà non è alla cronaca, ma alla verità emotiva della persona e del momento.`,
      `Andrea Morel resta fuori dall’inquadratura. Guarda, ascolta e ricostruisce ciò che può essere accaduto tra una frase pronunciata e quella rimasta in silenzio.`,
    ],
  },
  distanza: {
    tag: 'Storia · I',
    title: 'La distanza tra due silenzi',
    intro: 'Ci sono luoghi che non chiedono di essere ricordati.',
    body: [
      `Restano lì, al confine della memoria, come una luce accesa in una stanza vuota. Li riconosci soltanto quando sei già lontano: nel rumore basso del mare, nell'odore della pioggia sulla pietra, in quel modo preciso che ha il vento di farti abbassare lo sguardo.`,
      `Camminavo senza una meta chiara. La costa si allungava davanti a me, grigia e ostinata, mentre alle mie spalle il sentiero si cancellava. Ho pensato che anche le persone fanno così: entrano nella nostra vita con passi netti e poi, lentamente, diventano paesaggio.`,
      `Tra un silenzio e l'altro c'è sempre una distanza da attraversare. A volte basta una parola. Altre volte serve un viaggio intero.`,
    ],
  },
  treni: {
    tag: 'Taccuino di viaggio · I',
    title: 'I treni che partono di notte',
    intro: 'Di notte, ogni partenza sembra più definitiva.',
    body: [
      `Il finestrino restituiva il mio riflesso insieme alle luci della stazione. Per qualche istante non riuscivo a capire quale dei due mondi fosse quello vero: il vagone quasi vuoto o la città liquida oltre il vetro.`,
      `Sul sedile di fronte, un libro dimenticato era rimasto aperto a metà. Nessun nome, nessun biglietto. Solo una piega all'angolo di pagina quarantasette, come una piccola promessa di ritorno.`,
      `I treni notturni non portano soltanto persone. Trasportano versioni possibili di noi stessi, vite che avremmo potuto vivere se fossimo scesi una fermata prima.`,
    ],
  },
  domeniche: {
    tag: 'Cose minime · II',
    title: 'L’arte segreta delle domeniche',
    intro: 'Una domenica riuscita non lascia prove.',
    body: [
      `Comincia tardi, con il rumore di una moka e la luce che si sposta sul pavimento. Non pretende un programma. Non misura il tempo in risultati.`,
      `È un giorno che ci ricorda come stare, prima ancora di fare. Un libro lasciato aperto, una passeggiata senza destinazione, il pranzo che si allunga fino a confondersi con la sera.`,
      `Forse la lentezza non è una rinuncia. Forse è il modo più elegante che abbiamo trovato per opporci alla sparizione delle cose.`,
    ],
  },
  lettere: {
    tag: 'Archivio · III',
    title: 'Lettere mai spedite',
    intro: 'Scriviamo certe lettere proprio perché non arrivino.',
    body: [
      `Le teniamo in un cassetto, tra documenti che non servono più e fotografie di persone senza nome. La carta ingiallisce. L'inchiostro, invece, sembra aspettare.`,
      `Una lettera non spedita non è una conversazione fallita. È una stanza privata in cui possiamo dire la verità senza domandarle di avere conseguenze.`,
      `Ogni tanto le rileggo. Non per trovare il coraggio di inviarle, ma per incontrare la persona che ero quando ancora pensavo di farlo.`,
    ],
  },
};

const dialog = document.querySelector('#reader');
const content = dialog.querySelector('.reader-content');

document.querySelectorAll('[data-article]').forEach((button) => button.addEventListener('click', () => {
  const story = stories[button.dataset.article];
  content.innerHTML = `<p class="kicker">${story.tag}</p><h2>${story.title}</h2><p class="intro">${story.intro}</p>${story.body.map((paragraph) => `<p>${paragraph}</p>`).join('')}`;
  dialog.showModal();
  content.scrollTop = 0;
}));

dialog.querySelector('.reader-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

const footerCredit = document.querySelector('footer > div > span');
if (footerCredit) {
  const isItalianPage = document.documentElement.lang === 'it';
  footerCredit.textContent = isItalianPage
    ? '© 2026 Andrea Morel · Progetto editoriale e sito curati da Cristiano Maiello'
    : '© 2026 Andrea Morel · Editorial project and website curated by Cristiano Maiello';
}
