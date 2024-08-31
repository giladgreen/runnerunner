import { fetchPlayerByUserId } from '@/app/lib/data';
import React from 'react';
import PlayerPagePlayerCreditHistory from '@/app/ui/client/PlayerPagePlayerCreditHistory';
import NoPlayerPage from '@/app/ui/client/NoPlayerPage';

export default async function PlayerCreditHistoryPage({
  params,
}: {
  params: { userId: string };
}) {
  const player = await fetchPlayerByUserId(params.userId);
  if (!player) {
    return <NoPlayerPage />;
  }

  return <PlayerPagePlayerCreditHistory player={player} />;
}
