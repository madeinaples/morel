# Cristiano Maiello — conversione editoriale (anteprima Fase 1)

## Decisione
Cristiano Maiello diventa la firma del sito e delle future pubblicazioni. Andrea Morel resta una firma storica e il nome del catalogo musicale esistente su SoundCloud. Non cancellare o riscrivere gli URL storici prima di una migrazione concordata.

## Principio
«Non ho ancora finito di giocare. E non vedo perché dovrei.»

La conversione non è un racconto motivazionale sull'età: mette in primo piano curiosità, ironia, responsabilità delle idee, libertà di cambiare, musica, fotografia e narrativa. Mantenere i Thread e le Porte Invisibili.

## Modifiche in questa PR
- Homepage italiana `/italiano` e inglese `/`: nome, testi, metadati visibili, link About, monogramma CM.
- Pagine biografiche attuali `/chi-e-morel.html` e `/about-morel.html`: nuova voce editoriale e fotografia esistente.
- Font/responsività del nuovo nome in homepage.
- Neutralizzati l'override biografico inline e la pulizia automatica del nome reale nel build per queste quattro pagine.
- Footer di queste quattro pagine adeguato; il resto del sito continua temporaneamente con i crediti storici.

## Cosa NON fa questa PR
- Nessun cambio dominio, DNS, Netlify primary domain o redirect tra domini.
- Nessuna variazione a canonical, hreflang, sitemap, robots.txt, analytics, cookie consent o URL articoli.
- Nessun merge automatico e nessuna modifica alle pubblicazioni musicali.
- Non sostituisce ancora vecchie firme, loghi e riferimenti su tutte le pagine interne; questa è una preview di direzione.

## Pre-lancio — controlli obbligatori
1. Verificare un deploy di anteprima Netlify per IT/EN e pagine About, compreso mobile 320px e desktop, menu, switch lingua, contrasto/focus, ritratto.
2. Controllare nel build output il nome Cristiano (il normalizzatore finale e lo script footer devono preservarlo).
3. Fare inventario completo dei riferimenti al vecchio nome su tutto il sito, distinguendo citazioni storiche, catalogo MOREL, firme/autore, SEO/metadata, asset, social e legale.
4. Creare successivamente i nuovi URL About, senza rompere quelli storici, e aggiornare navigazione coerente su tutte le pagine.
5. Verificare in Names.co.uk titolarità e scadenza di `cristianomaiello.co.uk`, poi in Netlify configurazione del sito e certificati HTTPS.
6. Solo con tutte le pagine pronte, decidere il dominio principale e pianificare mapping 301 URL-per-URL, canonical/hreflang, Search Console, sitemap e rollback.
7. Pubblicazione soltanto dopo revisione e approvazione esplicita di Cris.

## Note editoriali
Non eliminare contenuti né introdurre biografie o credenziali inventate. Tenere la firma sul sito distinta dal nome MOREL nei brani storici. Il ritratto attuale è un asset di risoluzione limitata; controllarne resa prima del lancio.
