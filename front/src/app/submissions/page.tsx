'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import styles from '@/styles/submissions/list.module.scss';
import { useRouter } from 'next/navigation';
import { CampaignStatusT } from '../campaigns/page';

export enum SubmissionStatusT {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  REJECTED = 'REJECTED',
}
type Submission = {
  id: string;
  content: string;
  status: SubmissionStatusT;
  createdAt: string;
  campaign: {
    id: string;
    title: string;
    description: string;
    budget: string;
    status: CampaignStatusT;
  };
  creator: {
    id: string;
    username?: string;
    walletAddress?: string;
  };
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/submissions');

      if (!res.ok) {
        throw new Error('Failed to fetch submissions');
      }

      const data: Submission[] = await res.json();
      setSubmissions(data);
    } catch {
      setError('Could not load submissions');
    } finally {
      setLoading(false);
    }
  };

  const deleteSubmission = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this submission?');
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:3001/submissions/${id}`, { method: 'DELETE' });

      if (!res.ok) {
        throw new Error('Failed to delete submission');
      }
      setSubmissions(prev => prev.filter(submission => submission.id !== id));
    } catch {
      alert('Error deleting submission');
    }
  };

  const updateSubmissionStatus = async (submission: Submission, nextStatus: SubmissionStatusT) => {
    try {
      const res = await fetch(`http://localhost:3001/submissions/${submission.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update status');
      }

      const updated: Submission = await res.json();

      setSubmissions(prev => prev.map(s => (s.id === updated.id ? updated : s)));
    } catch (err: any) {
      alert(err.message || 'Error updating submission status');
    }
  };

  const approveSubmission = async (submission: Submission) => {
    if (submission.status !== SubmissionStatusT.PENDING) {
      alert('Only pending submissions can be approved');
      return;
    }

    await updateSubmissionStatus(submission, SubmissionStatusT.APPROVED);
  };

  const rejectSubmission = async (submission: Submission) => {
    if (submission.status === SubmissionStatusT.PAID) {
      alert('Paid submissions cannot be rejected');
      return;
    }
    if (submission.status === SubmissionStatusT.REJECTED) {
      alert('Rejected submissions cannot be rejected');
      return;
    }
    const confirmed = confirm('Are you sure you want to reject this submission?');
    if (!confirmed) return;

    await updateSubmissionStatus(submission, SubmissionStatusT.REJECTED);
  };

  const paySubmission = async (submission: Submission) => {
    if (submission.status !== SubmissionStatusT.APPROVED) {
      alert('Only approved submissions can be paid');
      return;
    }

    const confirmed = confirm('This will pay the creator. Continue?');
    if (!confirmed) return;

    await updateSubmissionStatus(submission, SubmissionStatusT.PAID);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  if (loading) {
    return <div className={styles.listSubmission__state}>Loading submissions...</div>;
  }

  if (error) {
    return (
      <div className={`${styles.listSubmission__state} ${styles['listSubmission__state--error']}`}>
        {error}
      </div>
    );
  }

  return (
    <div className={styles.listSubmission}>
      <h1 className={styles.listSubmission__header}>Submissions</h1>

      <div className={styles.listSubmission__card}>
        <table>
          <thead>
            <tr>
              <th>Content</th>
              <th>Status</th>
              <th>Campaign</th>
              <th>Creator</th>
              <th>Created At</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {submissions.length === 0 && (
              <tr className={styles.emptyRow}>
                <td colSpan={6}>No submissions found</td>
              </tr>
            )}

            {submissions.map(submission => (
              <tr key={submission.id}>
                <td>
                  {submission.content.length > 50
                    ? submission.content.slice(0, 50) + '...'
                    : submission.content}
                </td>

                <td>{submission.status}</td>

                <td>{submission.campaign.title}</td>

                <td>{submission.creator.username ?? submission.creator.id}</td>

                <td>{new Date(submission.createdAt).toLocaleDateString()}</td>

                <td className={styles.listSubmission__actions}>
                  <button onClick={() => deleteSubmission(submission.id)} title="Delete submission">
                    <Trash2 size={18} />
                  </button>
                  {submission.status === SubmissionStatusT.PENDING && (
                    <button onClick={() => approveSubmission(submission)}>
                      Approve Submission
                    </button>
                  )}
                  {![SubmissionStatusT.REJECTED, SubmissionStatusT.PAID].includes(
                    submission.status,
                  ) && (
                    <button onClick={() => rejectSubmission(submission)}>Reject Submission</button>
                  )}
                  {![
                    SubmissionStatusT.REJECTED,
                    SubmissionStatusT.PAID,
                    SubmissionStatusT.PENDING,
                  ].includes(submission.status) && (
                    <button onClick={() => paySubmission(submission)}>Pay Submission</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
