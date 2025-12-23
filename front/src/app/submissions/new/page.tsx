'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/styles/submissions/create.module.scss';

export default function CreateSubmissionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const campaignId = searchParams.get('campaignId');
  const creatorId = searchParams.get('creatorId');
  const campaignName = searchParams.get('campaignName');
  const creatorName = searchParams.get('creatorName');

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!campaignId || !creatorId) {
      setError('Campaign or Creator is missing');
      return;
    }

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('http://localhost:3001/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          campaignId,
          creatorId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create submission');
      }

      setContent('');

      router.push('/submissions');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createSubmission}>
      <div className={styles.createSubmission__container}>
        <div className={styles.createSubmission__header}>
          <h1>Create Submission</h1>
          <p>Submit content for a campaign</p>
        </div>

        <div className={styles.createSubmission__card}>
          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>Campaign Name</label>
              <input className={styles.input} value={campaignName ?? ''} disabled />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Creator Name</label>
              <input className={styles.input} value={creatorName ?? ''} disabled />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="content">
                Submission Content
              </label>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                id="content"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Paste or write submission content..."
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button
                type="submit"
                disabled={loading || !campaignId || !creatorId}
                className={styles.button}
              >
                {loading ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
