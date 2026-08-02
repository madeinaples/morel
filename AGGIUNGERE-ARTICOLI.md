# Aggiungere un articolo

Ogni articolo deve contenere nel `<head>` una sezione assegnata:

```html
<meta property="article:section" content="andrea" />
```

I valori ammessi sono `andrea`, `pensieri` e `altri`. Devono inoltre essere presenti `article:published_time`, il collegamento canonico, il titolo `<h1>`, il testo `.article-deck` e il tempo di lettura nella `.kicker`.

La pubblicazione esegue `scripts/sync-archives.py`: aggiorna automaticamente l’archivio generale italiano e inglese, le pagine delle sezioni, l’ordine cronologico, il collegamento all’ultimo articolo nelle homepage e le date delle pagine indice nella sitemap.
