const BASE = process.env.BOT_API_URL;
const KEY = process.env.BOT_API_KEY;

async function botFetch(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'x-api-key': KEY },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`bot api error ${res.status} for ${path}`);
  }
  return res;
}

export async function getQuestions({ ders, konu } = {}) {
  const params = new URLSearchParams();
  if (ders) params.set('ders', ders);
  if (konu) params.set('konu', konu);
  const qs = params.toString();
  const res = await botFetch(`/api/questions${qs ? `?${qs}` : ''}`);
  return res.json();
}

export async function getQuestion(id) {
  const questions = await getQuestions();
  return questions.find((q) => String(q.id) === String(id)) ?? null;
}

export async function getStats() {
  const res = await botFetch('/api/stats');
  return res.json();
}

export async function getReport() {
  const res = await botFetch('/api/report');
  const data = await res.json();
  return data.report;
}

export async function getPhotoResponse(id) {
  return botFetch(`/api/questions/${id}/photo`);
}

export async function getExams() {
  const res = await botFetch('/api/exams');
  return res.json();
}

export async function getExamStats() {
  const res = await botFetch('/api/exams/stats');
  return res.json();
}

export async function createExam(payload) {
  const res = await fetch(`${BASE}/api/exams`, {
    method: 'POST',
    headers: { 'x-api-key': KEY, 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `bot api error ${res.status}`);
  }
  return data;
}
