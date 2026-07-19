import { requireSession } from '../../lib/auth';
import { getReport } from '../../lib/botApi';
import LogoutButton from '../LogoutButton';
import RefreshButton from './RefreshButton';

function ReportSection({ title, items, renderExtra }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="report-section">
      <h2>{title}</h2>
      <div className="report-items">
        {items.map((item, i) => (
          <div className="report-item" key={i}>
            <div className="report-item-header">
              <span className="report-item-konu">{item.konu}</span>
              {renderExtra ? renderExtra(item) : null}
            </div>
            {item.detay && <p className="report-item-detay">{item.detay}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function ReportPage() {
  requireSession();
  const { report, generatedAt } = await getReport();

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

      <div className="toolbar">
        {generatedAt && (
          <span className="question-date">
            Son güncelleme: {new Date(generatedAt).toLocaleString('tr-TR')}
          </span>
        )}
        <RefreshButton />
      </div>

      {report ? (
        <div className="report">
          {report.ozet && <div className="report-summary">{report.ozet}</div>}

          <ReportSection
            title="Kalıcı zayıf alanlar"
            items={report.kalici_zayif_alanlar}
          />

          <ReportSection
            title="Değişim sinyalleri"
            items={report.degisim_sinyalleri}
            renderExtra={(item) => (
              <span
                className={`report-badge ${
                  item.yon === 'iyilesme' ? 'improve' : 'worsen'
                }`}
              >
                {item.yon === 'iyilesme' ? 'İyileşme' : 'Kötüleşme'}
              </span>
            )}
          />

          <ReportSection
            title="Yeni ortaya çıkan konular"
            items={report.yeni_konular}
          />
        </div>
      ) : (
        <p className="empty-state">Henüz rapor oluşturulacak veri yok.</p>
      )}
    </div>
  );
}
