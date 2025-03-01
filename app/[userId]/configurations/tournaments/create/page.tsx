import Breadcrumbs from '@/app/ui/client/Breadcrumbs';
import { fetchUserById } from '@/app/lib/data';
import React from 'react';
import CreateTournamentForm from '@/app/ui/client/CreateTournamentForm';
import NoPermissionsPage from '@/app/ui/client/NoPermissionsPage';

export default async function CreateTournamentPage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await fetchUserById(params.userId);
  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;
  if (!isAdmin && !isWorker) {
    return <NoPermissionsPage />;
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: '.', href: `/${params.userId}` },
          {
            label: 'הגדרות',
            href: `/${params.userId}/configurations`,
          },
          {
            label: 'טורנירים',
            href: `/${params.userId}/configurations/tournaments`,
          },
          {
            label: 'יצירת טורניר',
            href: `/${params.userId}/configurations/tournaments/create`,
            active: true,
          },
        ]}
      />
      <CreateTournamentForm
        userId={params.userId}
        prevPage={`/${params.userId}/configurations/tournaments`}
      />
    </main>
  );
}
