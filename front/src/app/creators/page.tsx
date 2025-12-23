'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import styles from '@/styles/creators/list.module.scss';
import { useRouter } from 'next/navigation';

type Creator = {
  id: string;
  username: string;
  createdAt: string;
  walletAddress?: string;
  email?: string;
};

export default function CreatorPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/creators');
      setLoading(false);

      if (!res.ok) {
        throw new Error('Failed to fetch creators');
      }

      const data: Creator[] = await res.json();
      setCreators(data);
    } catch (err) {
      setError('Could not load brands');
    } finally {
      setLoading(false);
    }
  };

  const deleteCreator = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this creator?');
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:3001/creators/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete creator');
      }

      // Remove from UI (optimistic update)
      setCreators(prev => prev.filter(creator => creator.id !== id));
    } catch {
      alert('Error deleting creator');
    }
  };

  const createSubmission = (creatorId: string, creatorName: string) => {
    router.push(`/campaigns?creatorId=${creatorId}&creatorName=${creatorName}`);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  if (loading) {
    return <div className={styles.creators__state}>Loading creators...</div>;
  }

  if (error) {
    return (
      <div className={`${styles.creators__state} ${styles['creators__state--error']}`}>{error}</div>
    );
  }

  return (
    <div className={styles.creators}>
      <h1 className={styles.creators__header}>Creator</h1>

      <div className={styles.creators__card}>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Created At</th>
              <th>Wallet Address</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {creators.length === 0 && (
              <tr className={styles.emptyRow}>
                <td colSpan={3}>No brands found</td>
              </tr>
            )}

            {creators.map(creator => (
              <tr key={creator.id}>
                <td>{creator.username}</td>
                <td>{new Date(creator.createdAt).toLocaleDateString()}</td>
                <td>{creator.walletAddress}</td>
                <td>{creator.email}</td>
                <td className={styles.creators__actions}>
                  <button onClick={() => deleteCreator(creator.id)} title="Delete brand">
                    <Trash2 size={18} />
                  </button>

                  <button onClick={() => createSubmission(creator.id, creator.username)}>
                    Create Submission
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
