import React from 'react';
import { fetchAllChangeLogs } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/client/Breadcrumbs';
import PlayerChangeLogs from '@/app/ui/client/PlayerChangeLogs';

export default async function ChangeLogsPage({
                                                     params,
                                                   }: {
  params: { userId: string };
}){
  const changeLogs = await fetchAllChangeLogs();

  const playersChangedLogs = changeLogs.filter((changeLog) => changeLog.changed_entity === 'player:change');
  const playersDeletedLogs = changeLogs.filter((changeLog) => changeLog.changed_entity === 'player:deleted');
  return (
    <div className="rtl">
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
          },
          {
            label: 'שחקנים',
            href: `/${params.userId}/configurations/change-logs/players`,
            active: true,
          },
        ]}
      />

     <PlayerChangeLogs playersChangedLogs={playersChangedLogs} playersDeletedLogs={playersDeletedLogs} />
    </div>
  );
}
