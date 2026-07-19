import { notFound } from 'next/navigation';
import { requireSession } from '../../../lib/auth';
import { getQuestion } from '../../../lib/botApi';

export default async function QuestionDetail({ params }) {
  requireSession();
  const question = await getQuestion(params.id);
  if (!question) notFound();

  return (
    <div className="page">
      <a href="/" className="back-link">
        ← Sorulara dön
      </a>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/api/photo/${question.id}`} className="detail-photo" alt="" />

      <div className="detail-field">
        <div className="label">Ders</div>
        <div className="value">{question.ders}</div>
      </div>
      <div className="detail-field">
        <div className="label">Konu</div>
        <div className="value">{question.konu}</div>
      </div>
      <div className="detail-field">
        <div className="label">Özet</div>
        <div className="value">{question.ozet}</div>
      </div>
      <div className="detail-field">
        <div className="label">Tarih</div>
        <div className="value">{new Date(question.created_at).toLocaleString('tr-TR')}</div>
      </div>
    </div>
  );
}
