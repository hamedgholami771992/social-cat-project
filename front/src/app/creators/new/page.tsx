'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/creators/create.module.scss';

type Creator = {
  id: string;
  username: string;
  createdAt: string;
  walletAddress?: string;
  email?: string;
};

export default function CreateCreatorPage() {
  const router = useRouter();

  const [walletAddress, setWalletAddress] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!walletAddress.trim() || !username.trim() || !email.trim()) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('http://localhost:3001/creators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          username,
          email,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create creator');
      }

      // reset + redirect
      setWalletAddress('');
      setUsername('');
      setEmail('');
      router.push('/creators');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createBrand}>
      <div className={styles.createBrand__container}>
        <div className={styles.createBrand__header}>
          <h1>Create Creator</h1>
          <p>Add a new creator to the system</p>
        </div>

        <div className={styles.createBrand__card}>
          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="username">
                Username
              </label>
              <input
                className={styles.input}
                id="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input
                className={styles.input}
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="walletAddress">
                Wallet Address
              </label>
              <input
                className={styles.input}
                id="walletAddress"
                value={walletAddress}
                onChange={e => setWalletAddress(e.target.value)}
                placeholder="0x..."
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button type="submit" disabled={loading} className={styles.button}>
                {loading ? 'Creating…' : 'Create Creator'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
