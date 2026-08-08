function KpiTile({ label, value, dotColor }) {
  return (
    <div className="kpi-tile">
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">
        <span className="kpi-dot" style={{ background: dotColor }} />
        {label}
      </div>
    </div>
  );
}

export default function ReportKpiStrip({ report }) {
  const kalici = report.kalici_zayif_alanlar?.length ?? 0;
  const kotulesme =
    report.degisim_sinyalleri?.filter((s) => s.yon === 'kotulesme').length ?? 0;
  const iyilesme =
    report.degisim_sinyalleri?.filter((s) => s.yon === 'iyilesme').length ?? 0;
  const yeni = report.yeni_konular?.length ?? 0;

  if (kalici + kotulesme + iyilesme + yeni === 0) return null;

  return (
    <div className="kpi-strip">
      <KpiTile label="Kalıcı zayıf alan" value={kalici} dotColor="var(--text-muted)" />
      <KpiTile label="Kötüleşme" value={kotulesme} dotColor="var(--danger)" />
      <KpiTile label="İyileşme" value={iyilesme} dotColor="var(--accent)" />
      <KpiTile label="Yeni konu" value={yeni} dotColor="var(--text-muted)" />
    </div>
  );
}
