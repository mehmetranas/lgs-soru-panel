'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteQuestionButton({ id }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    if (!window.confirm('Bu soru silinsin mi? Bu işlem geri alınamaz.')) return;

    setLoading(true);
    setError('');

    const res = await fetch(`/api/questions/${id}`, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setLoading(false);
      setError(data.error || 'Silinemedi, tekrar dener misin?');
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <div>
      {error && <div className="error-banner">{error}</div>}
      <button
        type="button"
        className="button danger"
        onClick={handleDelete}
        disabled={loading}
      >
        {loading ? 'Siliniyor...' : 'Soruyu sil'}
      </button>
    </div>
  );
}
