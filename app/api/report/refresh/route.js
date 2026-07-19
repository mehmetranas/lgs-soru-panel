import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { refreshReport } from '../../../../lib/botApi';

export async function POST() {
  if (!getSession()) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const result = await refreshReport();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
