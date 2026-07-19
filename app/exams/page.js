import Link from 'next/link';
import { requireSession } from '../../lib/auth';
import { getExams, getExamStats } from '../../lib/botApi';
import LogoutButton from '../LogoutButton';
import ExamTrendChart from '../ExamTrendChart';

export default async function ExamsPage() {
  requireSession();
  const [exams, stats] = await Promise.all([getExams(), getExamStats()]);

  return (
    <div className="page">
      <div className="header">
        <h1>LGS Soru Takip</h1>
        <LogoutButton />
      </div>

      <div className="nav-tabs">
        <a href="/">Sorular</a>
        <a href="/exams" className="active">
          Denemeler
        </a>
        <a href="/report">Rapor</a>
      </div>

      <ExamTrendChart stats={stats} />

      <div className="toolbar">
        <Link href="/exams/new" className="button">
          Deneme ekle
        </Link>
      </div>

      {exams.length === 0 ? (
        <p className="empty-state">Henüz kayıtlı deneme yok.</p>
      ) : (
        <div className="question-list">
          {exams.map((exam) => (
            <div className="exam-card" key={exam.id}>
              <div className="exam-card-header">
                <div className="question-topic">
                  {exam.deneme_adi || 'İsimsiz deneme'}
                </div>
                <div className="question-date">
                  {new Date(exam.exam_date).toLocaleDateString('tr-TR')}
                </div>
              </div>
              <table className="chart-table">
                <thead>
                  <tr>
                    <th>Ders</th>
                    <th>Doğru</th>
                    <th>Yanlış</th>
                    <th>Boş</th>
                  </tr>
                </thead>
                <tbody>
                  {exam.results.map((r) => (
                    <tr key={r.ders}>
                      <td>{r.ders}</td>
                      <td>{r.dogru}</td>
                      <td>{r.yanlis}</td>
                      <td>{r.bos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
