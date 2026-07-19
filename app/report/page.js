import { requireSession } from '../../lib/auth';
import { getReport } from '../../lib/botApi';
import LogoutButton from '../LogoutButton';

export default async function ReportPage() {
  requireSession();
  const report = await getReport();

  return (
    <div className="page">
      <div className="header">
        <h1>LGS Soru Takip</h1>
        <LogoutButton />
      </div>

      <div className="nav-tabs">
        <a href="/">Sorular</a>
        <a href="/exams">Denemeler</a>
        <a href="/report" className="active">
          Rapor
        </a>
      </div>

      {report ? (
        <div className="report-text">{report}</div>
      ) : (
        <p className="empty-state">Henüz rapor oluşturulacak veri yok.</p>
      )}
    </div>
  );
}
