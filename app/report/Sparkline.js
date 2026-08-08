const WIDTH = 120;
const HEIGHT = 28;
const BAR_GAP = 3;

export default function Sparkline({ aylik, color }) {
  if (!aylik || aylik.length < 2) return null;

  const max = Math.max(1, ...aylik.map((m) => m.sayi));
  const barWidth = (WIDTH - BAR_GAP * (aylik.length - 1)) / aylik.length;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width={WIDTH}
      height={HEIGHT}
      className="sparkline"
      role="img"
      aria-label="Aylık dağılım"
    >
      {aylik.map((m, i) => {
        const barHeight = Math.max(2, (m.sayi / max) * HEIGHT);
        const x = i * (barWidth + BAR_GAP);
        const y = HEIGHT - barHeight;
        return (
          <rect
            key={m.ay}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            rx={2}
            fill={color}
            opacity={0.85}
          />
        );
      })}
    </svg>
  );
}
