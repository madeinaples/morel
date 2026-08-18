# Aggiungere un articolo

Ogni articolo deve contenere nel `<head>` una sezione assegnata:

```html
<meta property="article:section" content="andrea" />
```

I valori ammessi sono `andrea`, `pensieri`, `altri` e `small-codes`.

Devono inoltre essere presenti `article:published_time`, il collegamento canonico, il titolo `<h1>` e una descrizione editoriale. Gli articoli standard usano `.article-deck` e indicano il tempo di lettura nella `.kicker`; gli Small Codes usano `.code-deck` e vengono indicizzati come letture brevi.

La pubblicazione esegue `scripts/sync-archives.py`: aggiorna automaticamente l’archivio generale italiano e inglese, le pagine delle sezioni tradizionali, l’ordine cronologico globale, il collegamento all’ultimo articolo nelle homepage e le date delle pagine indice nella sitemap.

Gli articoli in `small-codes/` partecipano allo stesso ordine cronologico globale. La lingua viene letta dall’attributo `lang` della pagina, quindi le homepage italiane puntano solo a contenuti italiani e quelle inglesi solo a contenuti inglesi.
