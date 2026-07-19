'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function Filters({ dersOptions, konuOptions, currentDers, currentKonu }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key === 'ders') params.delete('konu');
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="toolbar">
      <select value={currentDers || ''} onChange={(e) => updateParam('ders', e.target.value)}>
        <option value="">Tüm dersler</option>
        {dersOptions.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <select value={currentKonu || ''} onChange={(e) => updateParam('konu', e.target.value)}>
        <option value="">Tüm konular</option>
        {konuOptions.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
    </div>
  );
}
