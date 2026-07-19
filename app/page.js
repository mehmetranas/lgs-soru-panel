import Link from 'next/link';
import { requireSession } from '../lib/auth';
import { getQuestions, getStats } from '../lib/botApi';
import LogoutButton from './LogoutButton';
import TrendChart from './TrendChart';
import Filters from './Filters';

export default async function HomePage({ searchParams }) {
  requireSession();
  const { ders, konu } = searchParams;
  const [questions, stats] = await Promise.all([getQuestions({ ders, konu }), getStats()]);

  const dersOptions = Array.from(new Set(stats.map((s) => s.ders))).sort();
  const konuOptions = Array.from(
    new Set(stats.filter((s) => !ders || s.ders === ders).map((s) => s.konu))
  ).sort();

  return (
    <div className="page">
      <div className="header">
        <h1>LGS Soru Takip</h1>
        <LogoutButton />
      </div>

      <div className="nav-tabs">
        <a href="/" className="active">
          Sorular
        </a>
        <a href="/exams">Denemeler</a>
        <a href="/report">Rapor</a>
      </div>

      <TrendChart stats={stats} />

      <Filters
        dersOptions={dersOptions}
        konuOptions={konuOptions}
        currentDers={ders}
        currentKonu={konu}
      />

      {questions.length === 0 ? (
        <p className="empty-state">Henüz kayıtlı soru yok.</p>
      ) : (
        <div className="question-list">
          {questions.map((q) => (
            <Link href={`/questions/${q.id}`} className="question-row" key={q.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/api/photo/${q.id}`} className="question-thumb" alt="" />
              <div className="question-meta">
                <div className="question-topic">{q.konu}</div>
                <div className="question-ders">{q.ders}</div>
                <div className="question-ozet">{q.ozet}</div>
              </div>
              <div className="question-date">
                {new Date(q.created_at).toLocaleDateString('tr-TR')}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
