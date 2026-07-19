'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RefreshButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    await fetch('/api/report/refresh', { method: 'POST' });
    setLoading(false);
    router.refresh();
  }

  return (
    <button className="button secondary" onClick={handleClick} disabled={loading}>
      {loading ? 'Yenileniyor...' : 'Yenile'}
    </button>
  );
}
