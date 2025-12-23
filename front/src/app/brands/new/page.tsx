'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/brands/create.module.scss';

export default function CreateBrandPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Brand name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('http://localhost:3001/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create brand');
      }

      // Redirect back to brands list
      setName('');
      router.push('/brands');
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
          <h1>Create Brand</h1>
          <p>Add a new brand to the system</p>
        </div>

        <div className={styles.createBrand__card}>
          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="brand-create">
                Brand Name
              </label>
              <input
                className={styles.input}
                id={'brand-create'}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Brand name"
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button type="submit" disabled={loading} className={styles.button}>
                {loading ? 'Creating…' : 'Create Brand'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
