import CreatePlayerForm from '@/app/ui/client/CreatePlayerForm';
import Breadcrumbs from '@/app/ui/client/Breadcrumbs';
import { fetchUserById } from '@/app/lib/data';
import React from 'react';
import CreateTournamentForm from "@/app/ui/client/CreateTournamentForm";

export default async function CreatePlayerPage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await fetchUserById(params.userId);
  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;
  if (!isAdmin && !isWorker) {
    return (
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl">
            <b>
              <u>אין לך הרשאות לראות עמוד זה</u>
            </b>
          </h1>
        </div>
      </div>
    );
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'טורנירים', href: `/${params.userId}/tournaments` },
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
