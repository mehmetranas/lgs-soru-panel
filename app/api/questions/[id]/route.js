import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { deleteQuestion } from '../../../../lib/botApi';

export async function DELETE(request, { params }) {
  if (!getSession()) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const result = await deleteQuestion(params.id);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
