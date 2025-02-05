import React from 'react';
import { fetchAllChangeLogs } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/client/Breadcrumbs';
import TournamentChangeLogs from '@/app/ui/client/TournamentChangeLogs';
import PrizeChangeLogs from '@/app/ui/client/PrizeChangeLogs';

export default async function TournamentsChangeLogsPage({
                                                     params,
                                                   }: {
  params: { userId: string };
}){
  const changeLogs = await fetchAllChangeLogs();

  const prizesChangedLogs = changeLogs.filter((changeLog) => changeLog.changed_entity === 'prize:change');
  const prizesDeletedLogs = changeLogs.filter((changeLog) => changeLog.changed_entity === 'prize:deleted');
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
            label: 'פרסים',
            href: `/${params.userId}/configurations/change-logs/prizes`,
            active: true,
          },
        ]}
      />

     <PrizeChangeLogs prizesChangedLogs={prizesChangedLogs} prizesDeletedLogs={prizesDeletedLogs} />
    </div>
  );
}
