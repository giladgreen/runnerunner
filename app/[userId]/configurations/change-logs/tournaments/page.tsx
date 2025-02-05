import React from 'react';
import { fetchAllChangeLogs } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/client/Breadcrumbs';
import TournamentChangeLogs from '@/app/ui/client/TournamentChangeLogs';

export default async function TournamentsChangeLogsPage({
                                                     params,
                                                   }: {
  params: { userId: string };
}){
  const changeLogs = await fetchAllChangeLogs();

  const tournamentsChangedLogs = changeLogs.filter((changeLog) => changeLog.changed_entity === 'tournament:change');
  const tournamentsDeletedLogs = changeLogs.filter((changeLog) => changeLog.changed_entity === 'tournament:deleted');
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
            label: 'טורנירים',
            href: `/${params.userId}/configurations/change-logs/tournaments`,
            active: true,
          },
        ]}
      />

     <TournamentChangeLogs tournamentsChangedLogs={tournamentsChangedLogs} tournamentsDeletedLogs={tournamentsDeletedLogs} />
    </div>
  );
}
