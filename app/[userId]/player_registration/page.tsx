import {
  fetchFeatureFlags,
  fetchPlayerByUserId,
  fetchTournaments,
} from '@/app/lib/data';
import PlayerPagePlayerRegistration from '@/app/ui/client/PlayerPagePlayerRegistration';
import React from 'react';
import NoPlayerPage from '@/app/ui/client/NoPlayerPage';

export default async function PlayerRegistrationPage({
  params,
}: {
  params: { userId: string; isAdminPlayer?: boolean };
}) {
  const player = await fetchPlayerByUserId(params.userId);
  if (!player) {
    return <NoPlayerPage />;
  }

  const tournaments = await fetchTournaments();
  const { rsvpEnabled, playerRsvpEnabled } = await fetchFeatureFlags();

  return (
    <PlayerPagePlayerRegistration
      player={player}
      thisWeekTournaments={tournaments}
      showRsvp={rsvpEnabled}
      playerRsvpEnabled={playerRsvpEnabled}
    />
  );
}
