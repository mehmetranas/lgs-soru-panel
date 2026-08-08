import Link from 'next/link';
import { requireSession } from '../../lib/auth';
import { getReport, getStats } from '../../lib/botApi';
import { dersColor } from '../dersColor';
import LogoutButton from '../LogoutButton';
import RefreshButton from './RefreshButton';
import ReportKpiStrip from './ReportKpiStrip';
import Sparkline from './Sparkline';
import DersBarChart from './DersBarChart';

function ReportSection({ title, items, renderExtra }) {
  if (!items || items.length === 0) return null;

  const maxSayi = Math.max(1, ...items.map((item) => item.sayi || 0));

  return (
    <div className="report-section">
      <h2>{title}</h2>
      <div className="report-items">
        {items.map((item, i) => {
          const color = dersColor(item.ders);
          const intensity = Math.max(0.3, (item.sayi || 0) / maxSayi);

          return (
            <div
              className="report-item"
              key={i}
              style={{ borderLeftColor: color, borderLeftWidth: `${2 + intensity * 4}px` }}
            >
              <div className="report-item-header">
                <span className="report-item-title">
                  {item.ders && (
                    <span className="ders-tag" style={{ color, borderColor: color }}>
                      {item.ders}
                    </span>
                  )}
                  <span className="report-item-konu">{item.konu}</span>
                </span>
                <span className="report-item-extra">
                  {item.sayi > 1 && <span className="report-count">{item.sayi} kez</span>}
                  {renderExtra ? renderExtra(item) : null}
                </span>
              </div>
              {item.detay && <p className="report-item-detay">{item.detay}</p>}
              {item.aylik?.length > 1 && (
                <Sparkline aylik={item.aylik} color={color} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default async function ReportPage() {
  requireSession();
  const [{ report, generatedAt }, stats] = await Promise.all([getReport(), getStats()]);

  return (
    <div className="page">
      <div className="header">
        <h1>LGS Soru Takip</h1>
        <LogoutButton />
      </div>

      <div className="nav-tabs">
        <Link href="/">Sorular</Link>
        <Link href="/exams">Denemeler</Link>
        <Link href="/report" className="active">
          Rapor
        </Link>
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

          <ReportKpiStrip report={report} />

          <DersBarChart stats={stats} />

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
                {item.yon === 'iyilesme' ? '▲ İyileşme' : '▼ Kötüleşme'}
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
