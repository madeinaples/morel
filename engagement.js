(() => {
  const isArticle = document.body.classList.contains('article-page');
  const isHome = document.body.classList.contains('home-v2');
  if (!isArticle && !isHome) return;

  const API = '/.netlify/functions/engagement';
  const lang = document.documentElement.lang === 'it' ? 'it' : 'en';
  const copy = lang === 'it'
    ? {
        like: 'Mi piace', liked: 'Ti piace', comments: 'Commenti', comment: 'Commenta',
        reply: 'Rispondi', cancelReply: 'Annulla risposta', replyingTo: 'Rispondi a',
        name: 'Il tuo nome', message: 'Scrivi un commento…', send: 'Pubblica',
        empty: 'Nessun commento ancora. Puoi essere il primo.', sending: 'Pubblicazione…',
        error: 'Qualcosa non ha funzionato. Riprova.', tooFast: 'Aspetta qualche secondo prima di pubblicare un altro commento.',
        title: 'Reazioni'
      }
    : {
        like: 'Like', liked: 'Liked', comments: 'Comments', comment: 'Comment',
        reply: 'Reply', cancelReply: 'Cancel reply', replyingTo: 'Replying to',
        name: 'Your name', message: 'Write a comment…', send: 'Post',
        empty: 'No comments yet. You can be the first.', sending: 'Posting…',
        error: 'Something went wrong. Please try again.', tooFast: 'Please wait a few seconds before posting another comment.',
        title: 'Reactions'
      };

  function newVisitorId() {
    return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function getCookieVisitorId(key) {
    const prefix = `${encodeURIComponent(key)}=`;
    const row = document.cookie.split('; ').find((item) => item.startsWith(prefix));
    return row ? decodeURIComponent(row.slice(prefix.length)) : null;
  }

  function persistVisitorId(key, id) {
    try { localStorage.setItem(key, id); } catch { /* cookie fallback below */ }
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(id)}; Max-Age=31536000; Path=/; SameSite=Lax; Secure`;
  }

  function getVisitorId() {
    const key = 'morel-visitor-id-v1';
    let id = null;
    try { id = localStorage.getItem(key); } catch { /* use first-party cookie */ }
    if (!id) id = getCookieVisitorId(key);
    if (!id) id = newVisitorId();
    persistVisitorId(key, id);
    return id;
  }

  function contentKeyFromUrl(url) {
    try {
      const path = new URL(url, window.location.origin).pathname;
      return path.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/$/, '') || '/';
    } catch {
      return window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
    }
  }

  const visitorId = getVisitorId();

  function injectStyles() {
    if (document.querySelector('#morel-engagement-styles')) return;
    const style = document.createElement('style');
    style.id = 'morel-engagement-styles';
    style.textContent = `
      .morel-engagement{max-width:760px;margin:72px auto 28px;padding:30px 0 0;border-top:1px solid rgba(255,255,255,.14);font-family:"DM Sans",Arial,sans-serif;color:inherit}
      .morel-engagement-head{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:22px}
      .morel-engagement-title{margin:0;font:400 12px/1.2 "DM Sans",Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;opacity:.65}
      .morel-engagement-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
      .morel-react-button{appearance:none;border:1px solid rgba(255,255,255,.18);background:transparent;color:inherit;border-radius:999px;padding:9px 13px;cursor:pointer;font:400 12px/1 "DM Sans",Arial,sans-serif;display:inline-flex;align-items:center;gap:7px;transition:.2s ease}
      .morel-react-button:hover{border-color:rgba(255,255,255,.48);transform:translateY(-1px)}
      .morel-react-button[aria-pressed="true"]{background:rgba(255,255,255,.10);border-color:rgba(255,255,255,.46)}
      .morel-heart{font-size:17px;line-height:1}
      .morel-comments{margin-top:22px}
      .morel-comment-list{display:grid;gap:14px;margin:0 0 22px}
      .morel-comment{padding:15px 0;border-bottom:1px solid rgba(255,255,255,.09)}
      .morel-comment.morel-reply{margin-left:28px;padding-left:16px;border-left:1px solid rgba(255,255,255,.13)}
      .morel-comment-meta{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:7px}
      .morel-comment-name{font-weight:500;font-size:12px}
      .morel-comment-date{font-size:10px;opacity:.5}
      .morel-comment-text{margin:0;font:300 15px/1.55 "Newsreader",Georgia,serif;white-space:pre-wrap;overflow-wrap:anywhere}
      .morel-comment-tools{margin-top:8px}
      .morel-reply-button{appearance:none;border:0;background:transparent;color:inherit;padding:0;cursor:pointer;font:500 10px/1 "DM Sans",Arial,sans-serif;letter-spacing:.04em;opacity:.58}
      .morel-reply-button:hover{opacity:1}
      .morel-comment-empty{margin:0 0 18px;font-size:12px;opacity:.6}
      .morel-reply-banner{display:none;align-items:center;justify-content:space-between;gap:12px;margin:0 0 10px;padding:8px 10px;border-left:2px solid rgba(255,255,255,.3);font-size:11px;opacity:.82}
      .morel-reply-banner.active{display:flex}
      .morel-reply-cancel{appearance:none;border:0;background:transparent;color:inherit;cursor:pointer;font:500 10px/1 "DM Sans",Arial,sans-serif;text-decoration:underline;text-underline-offset:3px}
      .morel-comment-form{display:grid;grid-template-columns:minmax(120px,190px) 1fr auto;gap:9px;align-items:start}
      .morel-comment-form input,.morel-comment-form textarea{width:100%;box-sizing:border-box;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.035);color:inherit;border-radius:10px;padding:11px 12px;font:400 12px/1.35 "DM Sans",Arial,sans-serif;outline:none}
      .morel-comment-form textarea{min-height:44px;resize:vertical}
      .morel-comment-form input:focus,.morel-comment-form textarea:focus{border-color:rgba(255,255,255,.45)}
      .morel-comment-submit{border:1px solid rgba(255,255,255,.26);background:rgba(255,255,255,.10);color:inherit;border-radius:10px;padding:12px 15px;cursor:pointer;font:500 11px/1 "DM Sans",Arial,sans-serif;letter-spacing:.04em}
      .morel-comment-submit:disabled{opacity:.45;cursor:wait}
      .morel-comment-status{grid-column:1/-1;margin:1px 0 0;font-size:10px;min-height:14px;opacity:.65}
      .morel-hp{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;overflow:hidden!important}
      .morel-inline-counts{display:inline-flex;align-items:center;gap:9px;margin-top:12px;font:400 10px/1 "DM Sans",Arial,sans-serif;letter-spacing:.04em;opacity:.62}
      @media(max-width:700px){.morel-engagement{margin:52px auto 20px;padding-top:24px}.morel-engagement-head{align-items:flex-start;flex-direction:column}.morel-comment.morel-reply{margin-left:14px;padding-left:12px}.morel-comment-form{grid-template-columns:1fr}.morel-comment-status{grid-column:1}.morel-comment-submit{justify-self:start}}
    `;
    document.head.appendChild(style);
  }

  async function request(method, payload, query = '') {
    const options = { method, headers: { 'content-type': 'application/json' } };
    if (payload) options.body = JSON.stringify(payload);
    const response = await fetch(`${API}${query}`, options);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { const error = new Error(data.error || 'request_failed'); error.code = data.code; throw error; }
    return data;
  }

  function formatDate(iso) {
    try { return new Intl.DateTimeFormat(lang === 'it' ? 'it-IT' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso)); } catch { return ''; }
  }

  function renderComments(list, comments, onReply) {
    list.innerHTML = '';
    if (!comments.length) { const empty = document.createElement('p'); empty.className = 'morel-comment-empty'; empty.textContent = copy.empty; list.appendChild(empty); return; }
    const byParent = new Map();
    comments.forEach((item) => { const parent = item.parentId || '__root__'; if (!byParent.has(parent)) byParent.set(parent, []); byParent.get(parent).push(item); });
    const appendComment = (item, depth = 0) => {
      const article = document.createElement('article'); article.className = depth > 0 ? 'morel-comment morel-reply' : 'morel-comment'; article.dataset.commentId = item.id;
      const meta = document.createElement('div'); meta.className = 'morel-comment-meta';
      const name = document.createElement('strong'); name.className = 'morel-comment-name'; name.textContent = item.name;
      const date = document.createElement('time'); date.className = 'morel-comment-date'; date.dateTime = item.createdAt; date.textContent = formatDate(item.createdAt);
      const text = document.createElement('p'); text.className = 'morel-comment-text'; text.textContent = item.message;
      const tools = document.createElement('div'); tools.className = 'morel-comment-tools';
      const reply = document.createElement('button'); reply.type = 'button'; reply.className = 'morel-reply-button'; reply.textContent = `↳ ${copy.reply}`; reply.addEventListener('click', () => onReply(item));
      tools.appendChild(reply); meta.append(name, date); article.append(meta, text, tools); list.appendChild(article);
      (byParent.get(item.id) || []).forEach((child) => appendComment(child, Math.min(depth + 1, 1)));
    };
    (byParent.get('__root__') || []).forEach((item) => appendComment(item, 0));
  }

  async function mountArticle() {
    injectStyles();
    const articleBody = document.querySelector('.article-body');
    if (!articleBody || document.querySelector('.morel-engagement')) return;
    const canonical = document.querySelector('link[rel="canonical"]')?.href || window.location.href;
    const content = contentKeyFromUrl(canonical);
    let replyingTo = null;
    const section = document.createElement('section'); section.className = 'morel-engagement'; section.setAttribute('aria-label', copy.title);
    section.innerHTML = `<div class="morel-engagement-head"><p class="morel-engagement-title">${copy.title}</p><div class="morel-engagement-actions"><button class="morel-react-button" type="button" data-morel-like aria-pressed="false"><span class="morel-heart">♡</span><span>${copy.like}</span><b data-like-count>0</b></button><button class="morel-react-button" type="button" data-morel-comment-jump><span>💬</span><span>${copy.comments}</span><b data-comment-count>0</b></button></div></div><div class="morel-comments" data-morel-comments><div class="morel-comment-list" data-comment-list></div><div class="morel-reply-banner" data-reply-banner><span data-reply-label></span><button type="button" class="morel-reply-cancel" data-reply-cancel>${copy.cancelReply}</button></div><form class="morel-comment-form" data-comment-form><label class="morel-hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><input name="name" maxlength="40" autocomplete="name" placeholder="${copy.name}" aria-label="${copy.name}" required><textarea name="message" maxlength="800" placeholder="${copy.message}" aria-label="${copy.message}" required></textarea><button class="morel-comment-submit" type="submit">${copy.send}</button><p class="morel-comment-status" data-comment-status aria-live="polite"></p></form></div>`;
    const end = articleBody.querySelector('.article-end'); if (end) articleBody.insertBefore(section, end); else articleBody.appendChild(section);
    const likeButton = section.querySelector('[data-morel-like]'), likeCount = section.querySelector('[data-like-count]'), commentCount = section.querySelector('[data-comment-count]'), commentList = section.querySelector('[data-comment-list]'), commentForm = section.querySelector('[data-comment-form]'), commentStatus = section.querySelector('[data-comment-status]'), jump = section.querySelector('[data-morel-comment-jump]'), replyBanner = section.querySelector('[data-reply-banner]'), replyLabel = section.querySelector('[data-reply-label]'), replyCancel = section.querySelector('[data-reply-cancel]');
    const clearReply = () => { replyingTo = null; replyBanner.classList.remove('active'); replyLabel.textContent = ''; };
    const beginReply = (item) => { replyingTo = item; replyLabel.textContent = `${copy.replyingTo} ${item.name}`; replyBanner.classList.add('active'); const textarea = commentForm.querySelector('textarea'); commentForm.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => textarea.focus({ preventScroll: true }), 250); };
    const refresh = async () => { const data = await request('GET', null, `?content=${encodeURIComponent(content)}&visitor=${encodeURIComponent(visitorId)}`); likeCount.textContent = data.likeCount; commentCount.textContent = data.commentCount; likeButton.setAttribute('aria-pressed', data.liked ? 'true' : 'false'); likeButton.querySelector('.morel-heart').textContent = data.liked ? '♥' : '♡'; likeButton.querySelector('span:nth-child(2)').textContent = data.liked ? copy.liked : copy.like; renderComments(commentList, data.comments || [], beginReply); return data; };
    likeButton.addEventListener('click', async () => { if (likeButton.disabled) return; likeButton.disabled = true; const liked = likeButton.getAttribute('aria-pressed') === 'true'; try { const data = await request('POST', { action: liked ? 'unlike' : 'like', content, visitorId }); likeCount.textContent = data.likeCount; likeButton.setAttribute('aria-pressed', data.liked ? 'true' : 'false'); likeButton.querySelector('.morel-heart').textContent = data.liked ? '♥' : '♡'; likeButton.querySelector('span:nth-child(2)').textContent = data.liked ? copy.liked : copy.like; } catch { commentStatus.textContent = copy.error; } finally { likeButton.disabled = false; } });
    jump.addEventListener('click', () => { clearReply(); commentForm.querySelector('textarea').focus({ preventScroll: true }); commentForm.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
    replyCancel.addEventListener('click', clearReply);
    commentForm.addEventListener('submit', async (event) => { event.preventDefault(); const submit = commentForm.querySelector('button[type="submit"]'); const formData = new FormData(commentForm); const payload = { action: 'comment', content, visitorId, name: String(formData.get('name') || '').trim(), message: String(formData.get('message') || '').trim(), website: String(formData.get('website') || '').trim(), parentId: replyingTo?.id || null }; if (!payload.name || !payload.message) return; submit.disabled = true; commentStatus.textContent = copy.sending; try { const data = await request('POST', payload); commentForm.querySelector('textarea').value = ''; commentStatus.textContent = ''; commentCount.textContent = data.commentCount; clearReply(); renderComments(commentList, data.comments || [], beginReply); } catch (error) { commentStatus.textContent = error.code === 'rate_limited' ? copy.tooFast : copy.error; } finally { submit.disabled = false; } });
    try { await refresh(); } catch { commentStatus.textContent = copy.error; }
  }

  async function mountHomeCounts() {
    injectStyles();
    const links = Array.from(document.querySelectorAll('a[href^="/storie/"], a[href^="/stories/"], a[href^="/small-codes/"]'));
    const unique = new Map();
    links.forEach((link) => { const key = contentKeyFromUrl(link.href); if (!unique.has(key)) unique.set(key, []); unique.get(key).push(link); });
    await Promise.all(Array.from(unique.entries()).map(async ([content, contentLinks]) => { try { const data = await request('GET', null, `?content=${encodeURIComponent(content)}&summary=1`); contentLinks.forEach((link) => { const host = link.closest('article, .reveal, .featured-flow > div') || link.parentElement; if (!host || host.querySelector(`.morel-inline-counts[data-content="${CSS.escape(content)}"]`)) return; const counts = document.createElement('span'); counts.className = 'morel-inline-counts'; counts.dataset.content = content; counts.innerHTML = `<span>♡ ${data.likeCount}</span><span>💬 ${data.commentCount}</span>`; link.insertAdjacentElement('afterend', counts); }); } catch { /* keep homepage clean if the API is temporarily unavailable */ } }));
  }

  if (isArticle) mountArticle();
  if (isHome) mountHomeCounts();
})();
