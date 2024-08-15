import CreatePlayerForm from '@/app/ui/client/CreatePlayerForm';
import Breadcrumbs from '@/app/ui/client/Breadcrumbs';
import { fetchUserById } from '@/app/lib/data';
import React from 'react';
import NoPermissionsPage from '@/app/ui/client/NoPermissionsPage';

export default async function CreatePlayerPage({
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
          { label: 'שחקנים', href: `/${params.userId}/players` },
          {
            label: 'יצירת שחקן',
            href: `/${params.userId}/players/create`,
            active: true,
          },
        ]}
      />
      <CreatePlayerForm
        userId={params.userId}
        prevPage={`/${params.userId}/players`}
      />
    </main>
  );
}
