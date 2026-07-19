import { NextResponse } from 'next/server';
import { getSession } from '../../../lib/auth';
import { createQuestion } from '../../../lib/botApi';

export async function POST(request) {
  if (!getSession()) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const incoming = await request.formData().catch(() => null);
  const photo = incoming?.get('photo');
  if (!photo || typeof photo === 'string') {
    return NextResponse.json({ error: 'photo zorunlu' }, { status: 400 });
  }

  const forward = new FormData();
  forward.append('photo', photo, photo.name);

  try {
    const result = await createQuestion(forward);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
