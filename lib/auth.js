import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionToken, COOKIE_NAME } from './session';

export function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export function requireSession() {
  const session = getSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}
