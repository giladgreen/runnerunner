import { clsx } from 'clsx';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

interface Breadcrumb {
  label: string;
  href?: string;
  active?: boolean;
  img?: string;
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="rtl mb-6 block">
      <ol className={clsx(lusitana.className, 'flex text-xl md:text-2xl')}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href ?? ''}
            aria-current={breadcrumb.active}
            className={clsx(
              breadcrumb.active ? 'text-gray-900' : 'text-gray-500',
            )}
          >
            {breadcrumb.label && !breadcrumb.img && (
              <Link href={breadcrumb.href ?? ''}>{breadcrumb.label}</Link>
            )}
            {breadcrumb.img && (
              <div style={{ display: 'flex' }}>
                <Image
                  src={breadcrumb.img}
                  className="zoom-on-hover mr-2 rounded-full"
                  width={35}
                  height={35}
                  alt={`profile picture`}
                />
                <span style={{ marginRight: 10 }}>{breadcrumb.label}</span>
              </div>
            )}
            {index < breadcrumbs.length - 1 ? (
              <span className="mx-3 inline-block">/</span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
