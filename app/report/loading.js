export default function ReportLoading() {
  return (
    <div className="page">
      <div className="header">
        <h1>LGS Soru Takip</h1>
      </div>

      <div className="nav-tabs">
        <span>Sorular</span>
        <span>Denemeler</span>
        <span className="active">Rapor</span>
      </div>

      <p className="loading-hint">
        Rapor hazırlanıyor... İlk oluşturmada bu ~10 saniye sürebilir.
      </p>

      <div className="report">
        <div className="skeleton skeleton-summary" />
        <div className="skeleton skeleton-section" />
        <div className="skeleton skeleton-section" />
        <div className="skeleton skeleton-section" />
      </div>
    </div>
  );
}
