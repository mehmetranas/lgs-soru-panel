import { DERS_ORDER, dersColor } from '../dersColor';

export default function DersBarChart({ stats }) {
  const totals = new Map();
  for (const row of stats) {
    totals.set(row.ders, (totals.get(row.ders) || 0) + Number(row.count));
  }

  const bars = Array.from(totals.entries())
    .map(([ders, count]) => ({ ders, count, color: dersColor(ders) }))
    .sort((a, b) => b.count - a.count || DERS_ORDER.indexOf(a.ders) - DERS_ORDER.indexOf(b.ders));

  if (bars.length === 0) return null;

  const max = Math.max(...bars.map((b) => b.count));

  return (
    <div className="chart-card">
      <h2 className="chart-card-title">Derse göre zorlanma yoğunluğu</h2>
      <div className="ders-bar-list">
        {bars.map((b) => (
          <div className="ders-bar-row" key={b.ders}>
            <span className="ders-bar-label">{b.ders}</span>
            <div className="ders-bar-track">
              <div
                className="ders-bar-fill"
                style={{ width: `${(b.count / max) * 100}%`, background: b.color }}
              />
            </div>
            <span className="ders-bar-value">{b.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
