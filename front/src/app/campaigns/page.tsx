'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import styles from '@/styles/campaigns/list.module.scss';
import { useRouter, useSearchParams } from 'next/navigation';

export enum CampaignStatusT {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

type Campaign = {
  id: string;
  title: string;
  budget: number;
  status: CampaignStatusT;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  brand?: {
    id: string;
    name: string;
  };
};

export default function CampaignPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const creatorId = searchParams.get('creatorId') || null;
  const creatorName = searchParams.get('creatorName') || null;

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/campaigns');

      if (!res.ok) {
        throw new Error('Failed to fetch campaigns');
      }

      const data: Campaign[] = await res.json();
      setCampaigns(data);
    } catch {
      setError('Could not load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaign = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this campaign?');
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:3001/campaigns/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete campaign');
      }

      // Optimistic update
      setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
    } catch {
      alert('Error deleting campaign');
    }
  };

  const createSubmission = (data: {
    campaignId: string;
    campaignName: string;
    creatorId: string;
    creatorName: string;
  }) => {
    router.push(
      `/submissions/new?campaignId=${data.campaignId}&campaignName=${data.campaignName}&creatorId=${data.creatorId}&creatorName=${data.creatorName}`,
    );
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  if (loading) {
    return <div className={styles.campaigns__state}>Loading campaigns...</div>;
  }

  if (error) {
    return (
      <div className={`${styles.campaigns__state} ${styles['campaigns__state--error']}`}>
        {error}
      </div>
    );
  }

  return (
    <div className={styles.campaigns}>
      <h1 className={styles.campaigns__header}>Campaigns</h1>

      <div className={styles.campaigns__card}>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Brand</th>
              <th>Status</th>
              <th>Budget</th>
              {/* <th>Start</th>
              <th>End</th> */}
              <th>Created</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {campaigns.length === 0 && (
              <tr className={styles.emptyRow}>
                <td colSpan={8}>No campaigns found</td>
              </tr>
            )}

            {campaigns.map(campaign => (
              <tr key={campaign.id}>
                <td>{campaign.title}</td>
                <td>{campaign.brand?.name ?? '—'}</td>
                <td>{campaign.status}</td>
                <td>${campaign.budget}</td>
                {/* <td>
                  {campaign.startDate
                    ? new Date(
                        campaign.startDate
                      ).toLocaleDateString()
                    : '—'}
                </td>
                <td>
                  {campaign.endDate
                    ? new Date(
                        campaign.endDate
                      ).toLocaleDateString()
                    : '—'}
                </td> */}
                <td>{new Date(campaign.createdAt).toLocaleDateString()}</td>
                <td className={styles.campaigns__actions}>
                  <button onClick={() => deleteCampaign(campaign.id)} title="Delete campaign">
                    <Trash2 size={18} />
                  </button>
                  {creatorId && creatorName && campaign.status !== CampaignStatusT.COMPLETED && (
                    <button
                      onClick={() =>
                        createSubmission({
                          campaignId: campaign.id,
                          campaignName: campaign.title,
                          creatorId: creatorId,
                          creatorName: creatorName,
                        })
                      }
                    >
                      Create Submission
                    </button>
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
