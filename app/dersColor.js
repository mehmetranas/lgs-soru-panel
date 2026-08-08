export const DERS_ORDER = [
  'Türkçe',
  'Matematik',
  'Fen Bilimleri',
  'Sosyal Bilgiler',
  'Din Kültürü ve Ahlak Bilgisi',
  'İngilizce',
];

const FALLBACK_COLOR = '#898781';

export function dersColor(ders) {
  const idx = DERS_ORDER.indexOf(ders);
  return idx === -1 ? FALLBACK_COLOR : `var(--ders-${idx + 1})`;
}
