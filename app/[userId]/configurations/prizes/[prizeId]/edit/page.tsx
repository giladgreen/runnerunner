import { fetchPrizesInfo } from '@/app/lib/data';
import React from 'react';
import { PrizeInfoDB } from '@/app/lib/definitions';
import EditPrizeInfoForm from '@/app/ui/client/EditPrizeInfoForm';
import Breadcrumbs from '@/app/ui/client/Breadcrumbs';

export default async function PrizesInfoEditPage({
  params,
}: {
  params: { userId: string; prizeId: string };
}) {
  const { userId, prizeId } = params;
  const prevPage = `/${userId}/configurations/prizes`;
  const prizes = await fetchPrizesInfo();
  const prize = prizes.find((prize) => prize.id === prizeId) as PrizeInfoDB;
  return (
    <div>

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
          },
          {
            label: prize ? prize.name : '-',
            href: `/${params.userId}/configurations/prizes/${prize ? prize.id : ''}/edit`,
            active: true,
          },
        ]}
      />
    <EditPrizeInfoForm prize={prize} prizes={prizes} prevPage={prevPage} userId={userId} />

    </div>
  );
}
