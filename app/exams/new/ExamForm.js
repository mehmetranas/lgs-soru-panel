'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const DERSLER = [
  'Türkçe',
  'Matematik',
  'Fen Bilimleri',
  'Sosyal Bilgiler',
  'Din Kültürü ve Ahlak Bilgisi',
  'İngilizce',
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function ExamForm() {
  const router = useRouter();
  const [denemeAdi, setDenemeAdi] = useState('');
  const [examDate, setExamDate] = useState(todayIso());
  const [rows, setRows] = useState(
    DERSLER.map((ders) => ({ ders, dogru: '', yanlis: '', bos: '' }))
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateRow(index, field, value) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const results = rows.map((r) => ({
      ders: r.ders,
      dogru: Number(r.dogru) || 0,
      yanlis: Number(r.yanlis) || 0,
      bos: Number(r.bos) || 0,
    }));

    const res = await fetch('/api/exams', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ denemeAdi: denemeAdi || null, examDate, results }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Kaydedilemedi, tekrar dener misin?');
      return;
    }

    router.push('/exams');
    router.refresh();
  }

  return (
    <form className="exam-form" onSubmit={handleSubmit}>
      {error && <div className="error-banner">{error}</div>}

      <div className="field">
        <label htmlFor="denemeAdi">Deneme adı (opsiyonel)</label>
        <input
          id="denemeAdi"
          type="text"
          value={denemeAdi}
          onChange={(e) => setDenemeAdi(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="examDate">Tarih</label>
        <input
          id="examDate"
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          required
        />
      </div>

      <div className="exam-form-row header">
        <div>Ders</div>
        <div>Doğru</div>
        <div>Yanlış</div>
        <div>Boş</div>
      </div>

      {rows.map((row, i) => (
        <div className="exam-form-row" key={row.ders}>
          <div>{row.ders}</div>
          <input
            type="number"
            min="0"
            value={row.dogru}
            onChange={(e) => updateRow(i, 'dogru', e.target.value)}
          />
          <input
            type="number"
            min="0"
            value={row.yanlis}
            onChange={(e) => updateRow(i, 'yanlis', e.target.value)}
          />
          <input
            type="number"
            min="0"
            value={row.bos}
            onChange={(e) => updateRow(i, 'bos', e.target.value)}
          />
        </div>
      ))}

      <button className="button" type="submit" disabled={loading} style={{ marginTop: 12 }}>
        {loading ? 'Kaydediliyor...' : 'Kaydet'}
      </button>
    </form>
  );
}
