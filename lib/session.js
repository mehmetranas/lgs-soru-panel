import crypto from 'crypto';

const COOKIE_NAME = 'session';
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 gün

function sign(payload) {
  const secret = process.env.SESSION_SECRET;
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createSessionToken(username) {
  const payload = JSON.stringify({ u: username, exp: Date.now() + SESSION_TTL_MS });
  const encoded = Buffer.from(payload).toString('base64url');
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [encoded, signature] = token.split('.');
  const expected = sign(encoded);
  const a = Buffer.from(signature || '');
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function timingSafeStringEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

function getUsers() {
  const raw = process.env.PANEL_USERS || '';
  return raw
    .split(',')
    .filter(Boolean)
    .map((pair) => {
      const [username, password] = pair.split(':');
      return { username, password };
    });
}

export function checkCredentials(username, password) {
  const users = getUsers();
  const match = users.find((u) => timingSafeStringEqual(u.username, username || ''));
  if (!match) return false;
  return timingSafeStringEqual(match.password, password || '');
}

export { COOKIE_NAME };
