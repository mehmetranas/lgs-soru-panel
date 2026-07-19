'use client';

import { useMemo, useRef, useState } from 'react';

const DERS_ORDER = [
  'Türkçe',
  'Matematik',
  'Fen Bilimleri',
  'Sosyal Bilgiler',
  'Din Kültürü ve Ahlak Bilgisi',
  'İngilizce',
];

const FALLBACK_COLOR = '#898781';

function dersColor(ders) {
  const idx = DERS_ORDER.indexOf(ders);
  return idx === -1 ? FALLBACK_COLOR : `var(--ders-${idx + 1})`;
}

function dateLabel(iso) {
  return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short' }).format(
    new Date(iso)
  );
}

const WIDTH = 720;
const HEIGHT = 260;
const PAD_LEFT = 32;
const PAD_RIGHT = 16;
const PAD_TOP = 16;
const PAD_BOTTOM = 32;

export default function ExamTrendChart({ stats }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const svgRef = useRef(null);

  const { dates, series, maxCount } = useMemo(() => {
    const dateSet = new Set();
    const byDers = new Map();

    for (const row of stats) {
      const dateKey = row.exam_date.slice(0, 10);
      dateSet.add(dateKey);
      if (!byDers.has(row.ders)) byDers.set(row.ders, new Map());
      byDers.get(row.ders).set(dateKey, Number(row.dogru));
    }

    const dates = Array.from(dateSet).sort();
    const series = Array.from(byDers.entries()).map(([ders, dateMap]) => ({
      ders,
      color: dersColor(ders),
      values: dates.map((d) => dateMap.get(d) ?? null),
    }));

    const maxCount = Math.max(1, ...series.flatMap((s) => s.values.filter((v) => v !== null)));

    return { dates, series, maxCount };
  }, [stats]);

  if (dates.length === 0) {
    return <p className="empty-state">Henüz deneme kaydı yok.</p>;
  }

  const plotWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;

  function xFor(i) {
    if (dates.length === 1) return PAD_LEFT + plotWidth / 2;
    return PAD_LEFT + (i / (dates.length - 1)) * plotWidth;
  }

  function yFor(value) {
    return PAD_TOP + plotHeight - (value / maxCount) * plotHeight;
  }

  const yTicks = 4;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round((maxCount / yTicks) * i)
  );

  function handleMove(e) {
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * WIDTH;
    let nearest = 0;
    let best = Infinity;
    dates.forEach((_, i) => {
      const dist = Math.abs(xFor(i) - x);
      if (dist < best) {
        best = dist;
        nearest = i;
      }
    });
    setHoverIdx(nearest);
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <div className="chart-card">
      <div style={{ position: 'relative' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          onMouseMove={handleMove}
          onMouseLeave={() => setHoverIdx(null)}
        >
          {yTickValues.map((v) => (
            <g key={v}>
              <line
                x1={PAD_LEFT}
                x2={WIDTH - PAD_RIGHT}
                y1={yFor(v)}
                y2={yFor(v)}
                stroke="var(--gridline)"
                strokeWidth="1"
              />
              <text
                x={PAD_LEFT - 8}
                y={yFor(v) + 4}
                fontSize="10"
                fill="var(--text-muted)"
                textAnchor="end"
              >
                {v}
              </text>
            </g>
          ))}

          {dates.map((d, i) => (
            <text
              key={d}
              x={xFor(i)}
              y={HEIGHT - 8}
              fontSize="10"
              fill="var(--text-muted)"
              textAnchor="middle"
            >
              {dateLabel(d)}
            </text>
          ))}

          {hoverIdx !== null && (
            <line
              x1={xFor(hoverIdx)}
              x2={xFor(hoverIdx)}
              y1={PAD_TOP}
              y2={HEIGHT - PAD_BOTTOM}
              stroke="var(--text-muted)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          )}

          {series.map((s) => {
            const points = s.values
              .map((v, i) => (v === null ? null : { i, v }))
              .filter(Boolean);
            return (
              <g key={s.ders}>
                {points.length > 1 && (
                  <path
                    d={points
                      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${xFor(p.i)} ${yFor(p.v)}`)
                      .join(' ')}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                )}
                {points.map((p) => (
                  <g key={p.i}>
                    <circle cx={xFor(p.i)} cy={yFor(p.v)} r="6" fill="var(--surface)" />
                    <circle cx={xFor(p.i)} cy={yFor(p.v)} r="4" fill={s.color} />
                  </g>
                ))}
              </g>
            );
          })}
        </svg>

        {hoverIdx !== null && tooltipPos && (
          <div
            className="chart-tooltip"
            style={{
              left: Math.min(tooltipPos.x + 12, WIDTH - 180),
              top: tooltipPos.y + 12,
            }}
          >
            <div className="tooltip-date">{dateLabel(dates[hoverIdx])}</div>
            {series.map((s) => (
              <div className="chart-tooltip-row" key={s.ders}>
                <span className="chart-tooltip-key">
                  <span className="chart-tooltip-line" style={{ background: s.color }} />
                  {s.ders}
                </span>
                <span className="chart-tooltip-value">{s.values[hoverIdx] ?? '—'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="chart-legend">
        {series.map((s) => (
          <div className="chart-legend-item" key={s.ders}>
            <span className="chart-legend-swatch" style={{ background: s.color }} />
            {s.ders}
          </div>
        ))}
      </div>

      <button className="chart-toggle" onClick={() => setShowTable((v) => !v)}>
        {showTable ? 'Tabloyu gizle' : 'Tablo görünümü'}
      </button>

      {showTable && (
        <table className="chart-table">
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Ders</th>
              <th>Doğru</th>
              <th>Yanlış</th>
              <th>Boş</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((row, i) => (
              <tr key={i}>
                <td>{dateLabel(row.exam_date)}</td>
                <td>{row.ders}</td>
                <td>{row.dogru}</td>
                <td>{row.yanlis}</td>
                <td>{row.bos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
