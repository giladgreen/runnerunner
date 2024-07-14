import { fetchPrizesInfo } from '@/app/lib/data';
import React from 'react';
import { PrizeInfoDB } from '@/app/lib/definitions';
import EditPrizeInfoForm from '@/app/ui/client/EditPrizeInfoForm';

export default async function PrizesInfoEditPage({
  params,
}: {
  params: { userId: string; prizeId: string };
}) {
  const { userId, prizeId } = params;
  const prevPage = `/${userId}/configurations/prizes`;
  const prizes = await fetchPrizesInfo();
  const prize = prizes.find((prize) => prize.id === prizeId) as PrizeInfoDB;

  return <EditPrizeInfoForm prize={prize} prevPage={prevPage} />;
}
