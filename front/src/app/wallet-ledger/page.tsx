'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import styles from '@/styles/wallet-ledger/list.module.scss';

export enum LedgerType {
  HOLD = 'HOLD',
  RELEASE = 'RELEASE',
}

type WalletLedger = {
  id: string;
  type: LedgerType;
  amount: number;
  createdAt: string;
  submission: {
    id: string;
    content: string;
    status: string;
  };
};

export default function WalletLedgersPage() {
  const [ledgers, setLedgers] = useState<WalletLedger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLedgers = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/wallet-ledger');

      if (!res.ok) {
        throw new Error('Failed to fetch wallet ledgers');
      }

      const data: WalletLedger[] = await res.json();
      setLedgers(data);
    } catch {
      setError('Could not load wallet ledgers');
    } finally {
      setLoading(false);
    }
  };

  const deleteLedger = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this ledger entry?');
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:3001/wallet-ledger/${id}`, { method: 'DELETE' });

      if (!res.ok) {
        throw new Error('Failed to delete ledger');
      }

      setLedgers(prev => prev.filter(l => l.id !== id));
    } catch {
      alert('Error deleting ledger');
    }
  };

  useEffect(() => {
    fetchLedgers();
  }, []);

  if (loading) {
    return <div className={styles.listLedger__state}>Loading wallet ledgers...</div>;
  }

  if (error) {
    return (
      <div className={`${styles.listLedger__state} ${styles['listLedger__state--error']}`}>
        {error}
      </div>
    );
  }

  return (
    <div className={styles.listLedger}>
      <h1 className={styles.listLedger__header}>Wallet Ledger</h1>

      <div className={styles.listLedger__card}>
        <table>
          <thead>
            <tr>
              <th>Submission</th>
              <th>Ledger Type</th>
              <th>Amount</th>
              <th>Submission Status</th>
              <th>Created At</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {ledgers.length === 0 && (
              <tr className={styles.emptyRow}>
                <td colSpan={6}>No ledger entries found</td>
              </tr>
            )}

            {ledgers.map(ledger => (
              <tr key={ledger.id}>
                <td>
                  {ledger.submission.content.length > 50
                    ? ledger.submission.content.slice(0, 50) + '...'
                    : ledger.submission.content}
                </td>

                <td>{ledger.type}</td>

                <td>{ledger.amount}</td>

                <td>{ledger.submission.status}</td>

                <td>{new Date(ledger.createdAt).toLocaleDateString()}</td>

                <td className={styles.listLedger__actions}>
                  <button onClick={() => deleteLedger(ledger.id)} title="Delete ledger entry">
                    <Trash2 size={18} />
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
