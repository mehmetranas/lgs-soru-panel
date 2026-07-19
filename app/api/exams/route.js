import { NextResponse } from 'next/server';
import { getSession } from '../../../lib/auth';
import { createExam } from '../../../lib/botApi';

export async function POST(request) {
  if (!getSession()) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  if (!payload) {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }

  try {
    const result = await createExam(payload);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
