import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { getPhotoResponse } from '../../../../lib/botApi';

export async function GET(request, { params }) {
  if (!getSession()) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const botRes = await getPhotoResponse(params.id).catch(() => null);
  if (!botRes) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  return new NextResponse(botRes.body, {
    headers: {
      'content-type': botRes.headers.get('content-type') || 'image/jpeg',
      'cache-control': 'private, max-age=3600',
    },
  });
}
