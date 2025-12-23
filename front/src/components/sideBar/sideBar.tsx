'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './sideBar.module.scss';

const links = [
  { label: 'Create Brand', href: '/brands/new' },
  { label: 'List Brands', href: '/brands' },
  { label: 'Create Creator', href: '/creators/new' },
  { label: 'List Creators', href: '/creators' },
  { label: 'Create Campaign', href: '/campaigns/new' },
  { label: 'List Campaigns', href: '/campaigns' },
  { label: 'List Submissions', href: '/submissions' },
  { label: 'List Ledger', href: '/wallet-ledger' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      {links.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={`${styles['sidebar-link']} ${pathname === link.href ? styles.active : ''}`}
        >
          {link.label}
        </Link>
      ))}
    </aside>
  );
}
