'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuestionForm() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(null);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    setSaved(null);
    setError('');
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError('Önce bir fotoğraf seç.');
      return;
    }

    setLoading(true);
    setError('');
    setSaved(null);

    const formData = new FormData();
    formData.append('photo', file);

    const res = await fetch('/api/questions', { method: 'POST', body: formData });
    const data = await res.json().catch(() => ({}));

    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Kaydedilemedi, tekrar dener misin?');
      return;
    }

    setSaved(data);
    setPreview(null);
    fileInputRef.current.value = '';
    router.refresh();
  }

  return (
    <form className="exam-form" onSubmit={handleSubmit}>
      {error && <div className="error-banner">{error}</div>}

      {saved && (
        <div className="detail-field">
          <div className="label">Kaydedildi</div>
          <div className="value">
            {saved.ders} · {saved.konu}
            <br />
            {saved.ozet}
          </div>
        </div>
      )}

      <div className="field">
        <label htmlFor="photo">Soru fotoğrafı</label>
        <input
          id="photo"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
        />
      </div>

      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="detail-photo" />
      )}

      <button className="button" type="submit" disabled={loading} style={{ marginTop: 12 }}>
        {loading ? 'İşleniyor...' : 'Soru ekle'}
      </button>
    </form>
  );
}
