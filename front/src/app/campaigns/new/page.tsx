'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/styles/campaigns/create.module.scss';

export default function CreateCampaignPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const brandId = searchParams.get('brandId');
  const brandName = searchParams.get('brandName');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  //   const [startDate, setStartDate] = useState('');
  //   const [endDate, setEndDate] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!brandId) {
      setError('Brand is missing');
      return;
    }

    if (
      !title.trim() ||
      !budget
      // || !startDate.length || !endDate.length
    ) {
      setError('Title, budget, start date. end date are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('http://localhost:3001/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          budget: Number(budget),
          //   startDate: startDate,
          //   endDate: endDate,
          brandId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message.join('\n') || 'Failed to create campaign');
      }

      // reset + redirect
      setTitle('');
      setDescription('');
      setBudget('');
      //   setStartDate('');
      //   setEndDate('');

      router.push('/campaigns');
    } catch (err: any) {
      console.log(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createCampaign}>
      <div className={styles.createCampaign__container}>
        <div className={styles.createCampaign__header}>
          <h1>Create Campaign</h1>
          <p>Create a campaign for the selected brand</p>
        </div>

        <div className={styles.createCampaign__card}>
          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>Brand Name</label>
              <input className={styles.input} value={brandName ?? ''} disabled />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="title">
                Title
              </label>
              <input
                className={styles.input}
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Campaign title"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="description">
                Description
              </label>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="budget">
                Budget
              </label>
              <input
                className={styles.input}
                id="budget"
                type="number"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                placeholder="1000"
              />
            </div>

            {/* <div className={styles.field}>
              <label className={styles.label} htmlFor="startDate">
                Start Date
              </label>
              <input
                className={styles.input}
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div> */}

            {/* <div className={styles.field}>
              <label className={styles.label} htmlFor="endDate">
                End Date
              </label>
              <input
                className={styles.input}
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div> */}

            {error && (
              <p className={styles.error}>
                {error.split('\n').map((err, ind) => (
                  <>
                    <br />
                    <span>{err}</span>
                  </>
                ))}
              </p>
            )}

            <div className={styles.actions}>
              <button type="submit" className={styles.button} disabled={loading || !brandId}>
                {loading ? 'Creating…' : 'Create Campaign'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
