import { getStore } from '@netlify/blobs';

const store = getStore('morel-engagement');
const MAX_COMMENTS = 100;

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff'
  }
});

const clean = (value, max) => String(value || '')
  .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
  .trim()
  .slice(0, max);

function normalizeContent(value) {
  let content = clean(value, 240);
  if (!content.startsWith('/')) content = `/${content}`;
  content = content.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/$/, '') || '/';
  if (!/^\/[a-zA-Z0-9/_-]*$/.test(content)) return null;
  return content;
}

function normalizeVisitor(value) {
  const visitor = clean(value, 100);
  return /^[a-zA-Z0-9-]{8,100}$/.test(visitor) ? visitor : null;
}

function normalizeId(value) {
  const id = clean(value, 80);
  return /^[a-zA-Z0-9-]{8,80}$/.test(id) ? id : null;
}

const segment = (content) => encodeURIComponent(content);
const likePrefix = (content) => `likes/${segment(content)}/`;
const commentPrefix = (content) => `comments/${segment(content)}/`;

async function getLikeCount(content) {
  const { blobs } = await store.list({ prefix: likePrefix(content) });
  return blobs.length;
}

async function getCommentRows(content, limit = MAX_COMMENTS) {
  const { blobs } = await store.list({ prefix: commentPrefix(content) });
  const selected = blobs.slice(-limit);
  const rows = await Promise.all(selected.map(async ({ key }) => {
    try {
      const item = await store.get(key, { consistency: 'strong', type: 'json' });
      return item ? { key, item } : null;
    } catch {
      return null;
    }
  }));
  return rows.filter(Boolean).sort((a, b) => new Date(a.item.createdAt) - new Date(b.item.createdAt));
}

async function getComments(content) {
  const rows = await getCommentRows(content);
  return rows.map(({ item }) => item);
}

async function snapshot(content, visitor, summaryOnly = false) {
  const [likeCount, comments] = await Promise.all([
    getLikeCount(content),
    summaryOnly ? Promise.resolve([]) : getComments(content)
  ]);
  let liked = false;
  if (visitor) liked = Boolean(await store.getMetadata(`${likePrefix(content)}${visitor}`, { consistency: 'strong' }));

  let commentCount;
  if (summaryOnly) {
    const listed = await store.list({ prefix: commentPrefix(content) });
    commentCount = listed.blobs.length;
  } else {
    commentCount = comments.length;
  }
  return { content, likeCount, commentCount, liked, comments };
}

function adminTokenFrom(req) {
  return clean(req.headers.get('x-morel-admin-token'), 200);
}

function isAdmin(req) {
  const expected = String(process.env.MOREL_ADMIN_TOKEN || '');
  const supplied = adminTokenFrom(req);
  return expected.length >= 16 && supplied.length >= 16 && supplied === expected;
}

async function adminListComments() {
  const { blobs } = await store.list({ prefix: 'comments/' });
  const selected = blobs.slice(-300).reverse();
  const rows = await Promise.all(selected.map(async ({ key }) => {
    try {
      const item = await store.get(key, { consistency: 'strong', type: 'json' });
      const encoded = key.slice('comments/'.length).split('/')[0];
      const content = decodeURIComponent(encoded);
      return item ? { ...item, content } : null;
    } catch {
      return null;
    }
  }));
  return rows.filter(Boolean).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function deleteCommentTree(content, targetId) {
  const rows = await getCommentRows(content, 500);
  const ids = new Set([targetId]);
  let changed = true;
  while (changed) {
    changed = false;
    rows.forEach(({ item }) => {
      if (item.parentId && ids.has(item.parentId) && !ids.has(item.id)) {
        ids.add(item.id);
        changed = true;
      }
    });
  }
  const matches = rows.filter(({ item }) => ids.has(item.id));
  await Promise.all(matches.map(({ key }) => store.delete(key)));
  return matches.length;
}

export default async (req) => {
  try {
    if (req.method === 'GET') {
      const url = new URL(req.url);
      if (url.searchParams.get('admin') === '1') {
        if (!isAdmin(req)) return json({ error: 'unauthorized' }, 401);
        const comments = await adminListComments();
        return json({ comments, count: comments.length });
      }

      const content = normalizeContent(url.searchParams.get('content'));
      if (!content) return json({ error: 'invalid_content' }, 400);
      const visitor = normalizeVisitor(url.searchParams.get('visitor'));
      const summaryOnly = url.searchParams.get('summary') === '1';
      return json(await snapshot(content, visitor, summaryOnly));
    }

    if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') return json({ error: 'invalid_json' }, 400);
    const action = clean(body.action, 30);

    if (action === 'admin_delete_comment') {
      if (!isAdmin(req)) return json({ error: 'unauthorized' }, 401);
      const content = normalizeContent(body.content);
      const commentId = normalizeId(body.commentId);
      if (!content || !commentId) return json({ error: 'invalid_request' }, 400);
      const deleted = await deleteCommentTree(content, commentId);
      return json({ deleted, commentId, content });
    }

    const content = normalizeContent(body.content);
    const visitorId = normalizeVisitor(body.visitorId);
    if (!content || !visitorId) return json({ error: 'invalid_request' }, 400);

    if (action === 'like' || action === 'unlike') {
      const key = `${likePrefix(content)}${visitorId}`;
      const before = await getLikeCount(content);
      const existed = Boolean(await store.getMetadata(key, { consistency: 'strong' }));

      if (action === 'like' && !existed) await store.setJSON(key, { createdAt: new Date().toISOString() }, { onlyIfNew: true });
      if (action === 'unlike' && existed) await store.delete(key);

      const likeCount = action === 'like'
        ? before + (existed ? 0 : 1)
        : Math.max(0, before - (existed ? 1 : 0));

      return json({ content, likeCount, liked: action === 'like' });
    }

    if (action === 'comment') {
      if (clean(body.website, 200)) return json(await snapshot(content, visitorId));

      const name = clean(body.name, 40);
      const message = clean(body.message, 800);
      const parentId = body.parentId ? normalizeId(body.parentId) : null;
      if (name.length < 2 || message.length < 2 || (body.parentId && !parentId)) return json({ error: 'invalid_comment' }, 400);

      if (parentId) {
        const existing = await getComments(content);
        if (!existing.some((item) => item.id === parentId)) return json({ error: 'parent_not_found' }, 404);
      }

      const rateKey = `rates/${segment(content)}/${visitorId}`;
      const last = await store.get(rateKey, { consistency: 'strong', type: 'json' }).catch(() => null);
      const now = Date.now();
      if (last?.at && now - last.at < 15000) return json({ error: 'rate_limited', code: 'rate_limited' }, 429);

      await store.setJSON(rateKey, { at: now });
      const id = crypto.randomUUID();
      const comment = { id, name, message, createdAt: new Date(now).toISOString(), parentId: parentId || null };
      await store.setJSON(`${commentPrefix(content)}${now}-${id}`, comment, { onlyIfNew: true });

      const data = await snapshot(content, visitorId);
      if (!data.comments.some((item) => item.id === id)) {
        data.comments.push(comment);
        data.comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        data.commentCount += 1;
      }
      return json(data, 201);
    }

    return json({ error: 'unknown_action' }, 400);
  } catch (error) {
    console.error('morel engagement error', error);
    return json({ error: 'server_error' }, 500);
  }
};

export const config = { path: '/.netlify/functions/engagement' };
