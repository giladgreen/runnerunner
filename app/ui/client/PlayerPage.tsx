import { fetchPlayerByUserId } from '@/app/lib/data';

import React from 'react';
import PlayerPagePlayerDetails from '@/app/ui/client/PlayerPagePlayerDetails';
import NoPlayerPage from '@/app/ui/client/NoPlayerPage';

export default async function PlayerPage({
  params,
}: {
  params: { userId: string };
}) {
  const player = await fetchPlayerByUserId(params.userId);
  if (!player) {
    return <NoPlayerPage />;
  }

  return (
    <div className="rtl" style={{ marginTop: 20 }}>
      <PlayerPagePlayerDetails player={player} showHistoryData={true}/>
    </div>
  );
}
