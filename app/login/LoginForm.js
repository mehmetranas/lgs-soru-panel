'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError('Kullanıcı adı veya şifre hatalı.');
      return;
    }
    const next = searchParams.get('next') || '/';
    router.push(next);
    router.refresh();
  }

  return (
    <form className="login-card" onSubmit={handleSubmit}>
      <h1>LGS Soru Takip</h1>
      {error && <div className="error-banner">{error}</div>}
      <div className="field">
        <label htmlFor="username">Kullanıcı adı</label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="password">Şifre</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>
      <button className="button" type="submit" disabled={loading} style={{ width: '100%' }}>
        {loading ? 'Giriş yapılıyor...' : 'Giriş yap'}
      </button>
    </form>
  );
}
