import React from 'react';
import { fetchFeatureFlags } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/client/Breadcrumbs';

export default async function ChangeLogsPage({
                                                     params,
                                                   }: {
  params: { userId: string };
}){

  const { prizesEnabled } = await fetchFeatureFlags();

  return <div>
    <Breadcrumbs
      breadcrumbs={[
        { label: '.', href: `/${params.userId}` },
        {
          label: 'הגדרות',
          href: `/${params.userId}/configurations`,
        },
        {
          label: 'מעקב שינויים',
          href: `/${params.userId}/configurations/change-logs`,
          active: true,
        },
      ]}
    />
    <ul className="rtl" style={{ color: 'white', listStyleType: 'disc' }}>
      <li>
        <a
          href={`/${params.userId}/configurations/change-logs/players`}
          className=""
        >
          שחקנים
        </a>
      </li>
      <li style={{ marginTop: 10 }}>
        <a
          href={`/${params.userId}/configurations/change-logs/tournaments`}
          className=""
        >
          טורנירים
        </a>
      </li>
      {prizesEnabled && <li style={{ marginTop: 10 }}>
        <a
          href={`/${params.userId}/configurations/change-logs/prizes`}
          className=""
        >
          פרסים
        </a>
      </li>}
    </ul>

  </div>
}
