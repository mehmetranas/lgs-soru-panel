import { NextResponse } from 'next/server';
import { checkCredentials, createSessionToken, COOKIE_NAME } from '../../../lib/session';

export async function POST(request) {
  const { username, password } = await request.json().catch(() => ({}));

  if (!checkCredentials(username, password)) {
    return NextResponse.json({ error: 'invalid credentials' }, { status: 401 });
  }

  const token = createSessionToken(username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });
  return res;
}
