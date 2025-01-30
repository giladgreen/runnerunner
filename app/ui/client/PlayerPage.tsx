import { fetchFeatureFlags, fetchPlayerByUserId } from '@/app/lib/data';

import React from 'react';
import PlayerPagePlayerDetails from '@/app/ui/client/PlayerPagePlayerDetails';
import NoPlayerPage from '@/app/ui/client/NoPlayerPage';

export default async function PlayerPage({
  params,
}: {
  params: { userId: string };
}) {
  const { playersSeeCreditEnabled } = await fetchFeatureFlags();
  const player = await fetchPlayerByUserId(params.userId);
  if (!player) {
    return <NoPlayerPage />;
  }

  return (
    <div className="rtl" >
      <PlayerPagePlayerDetails player={player} showCreditData={playersSeeCreditEnabled}/>
    </div>
  );
}
