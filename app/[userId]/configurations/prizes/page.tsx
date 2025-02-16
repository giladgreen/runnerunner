import React from 'react';
import { lusitana } from '@/app/ui/fonts';
import { fetchPrizesInfo, fetchUserById } from '@/app/lib/data';

import Breadcrumbs from '@/app/ui/client/Breadcrumbs';
import NoPermissionsPage from '@/app/ui/client/NoPermissionsPage';

import PrizesTable from '@/app/ui/client/PrizesTable';
import OpenCreatePrizeModalButton from '@/app/ui/client/OpenCreatePrizeModalButton';

export default async function PrizesInfoPage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await fetchUserById(params.userId);
  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;

  const prizes = await fetchPrizesInfo();
  if (!isAdmin && !isWorker) {
    return <NoPermissionsPage />;
  }

  const prizesCount = prizes.length;
  return (
    <div className="rtl w-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: '.', href: `/${params.userId}` },
          {
            label: 'הגדרות',
            href: `/${params.userId}/configurations`,
          },
          {
            label: 'פרסים',
            href: `/${params.userId}/configurations/prizes`,
            active: true,
          },
        ]}
      />

      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          <b>
            <u>
              {prizesCount === 0
                ? 'אין עוד מידע על פרסים'
                : `פרסים (${prizesCount})`}
            </u>
          </b>
        </h1>
      </div>
      <div>
        <div className="">
          <OpenCreatePrizeModalButton prizes={prizes}/>
        </div>
      </div>
      {prizesCount > 0 && (
        <div className="rtl mt-4 flex items-center justify-between gap-2 md:mt-8">
          <PrizesTable prizes={prizes} userId={params.userId} />
        </div>
      )}
    </div>
  );
}
