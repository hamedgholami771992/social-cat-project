'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import styles from '../../styles/brands/list.module.scss';
import { useRouter } from 'next/navigation';

type Brand = {
  id: string;
  name: string;
  createdAt: string;
};

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/brands');
      setLoading(false);

      if (!res.ok) {
        throw new Error('Failed to fetch brands');
      }

      const data: Brand[] = await res.json();
      setBrands(data);
    } catch (err) {
      setError('Could not load brands');
    } finally {
      setLoading(false);
    }
  };

  const deleteBrand = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this brand?');
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:3001/brands/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete brand');
      }

      // Remove from UI (optimistic update)
      setBrands(prev => prev.filter(brand => brand.id !== id));
    } catch {
      alert('Error deleting brand');
    }
  };

  const createCampaign = (brandId: string, brandName: string) => {
    router.push(`/campaigns/new?brandId=${brandId}&brandName=${brandName}`);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  if (loading) {
    return <div className={styles.brands__state}>Loading brands...</div>;
  }

  if (error) {
    return (
      <div className={`${styles.brands__state} ${styles['brands__state--error']}`}>{error}</div>
    );
  }

  return (
    <div className={styles.brands}>
      <div className={styles.brands__header}>
        <h1>Brands</h1>
        <p>Manage registered brands</p>
      </div>

      <div className={styles.brands__card}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Created At</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {brands.length === 0 && (
              <tr className={styles.emptyRow}>
                <td colSpan={3}>No brands found</td>
              </tr>
            )}

            {brands.map(brand => (
              <tr key={brand.id}>
                <td>{brand.name}</td>
                <td>{new Date(brand.createdAt).toLocaleDateString()}</td>
                <td className={styles.brands__actions}>
                  <button onClick={() => deleteBrand(brand.id)}>
                    <Trash2 size={18} />
                  </button>
                  <button onClick={() => createCampaign(brand.id, brand.name)}>
                    Create Campaign
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
