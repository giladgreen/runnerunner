import PlayersPrizesPage from '@/app/[userId]/prizes/PlayersPrizesPage';
import {fetchPlayersPrizes, fetchPrizesInfo, fetchUserById} from '@/app/lib/data';
import React from 'react';
import Link from 'next/link';
import { Button } from 'primereact/button';
import {getPlayersPrizesContent, getPlayersPrizesContents} from "@/app/ui/client/helpers";
import NoPermissionsPage from "@/app/ui/client/NoPermissionsPage";

export default async function PrizesPage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await fetchUserById(params.userId);
  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;
  if (!isAdmin && !isWorker) {
    return <NoPermissionsPage />
  }
    const playerPrizes = await fetchPlayersPrizes(user?.phone_number);
    const prizesInformation = await fetchPrizesInfo();
  const { chosenPrizes, deliveredPrizes, readyToBeDeliveredPrizes } =playerPrizes;
  const prizesContents = await getPlayersPrizesContents(
      chosenPrizes,
      deliveredPrizes,
      readyToBeDeliveredPrizes,
      prizesInformation,
      null,
      false,
  );

    return (
    <div className="rtl">
      <a
        href={`/${params.userId}/configurations/prizes`}
        style={{ marginTop: -15, color: 'blue' }}
      >
        <u>הגדרות פרסים</u>
      </a>
      <div style={{ marginTop: 30 }}>
        <PlayersPrizesPage playerPrizes={playerPrizes} prizesContents={prizesContents}/>
      </div>
    </div>
  );
}
