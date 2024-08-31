import {
  fetchFeatureFlags,
  fetchPlayerByUserId,
  fetchPlayerCurrentTournamentHistory,
  fetchRsvpCountForTodayTournament,
  fetchTournamentsByDay,
} from '@/app/lib/data';
import { getTodayShortDate } from '@/app/lib/serverDateUtils';
import PlayerPagePlayerRegistration from '@/app/ui/client/PlayerPagePlayerRegistration';
import React from 'react';
import { rsvpPlayerForDay } from '@/app/lib/actions';
import NoPlayerPage from '@/app/ui/client/NoPlayerPage';

export default async function PlayerRegistrationPage({
  isAdminPlayer,
  params,
}: {
  isAdminPlayer?: boolean
  params: { userId: string,  };
}) {
  const player = await fetchPlayerByUserId(params.userId);
  if (!player) {
    return <NoPlayerPage />;
  }

  const todayTournaments = await fetchTournamentsByDay();
  const rsvpCountsForTodayTournaments = await Promise.all(
    todayTournaments.map((todayTournament) =>
      fetchRsvpCountForTodayTournament(todayTournament.id),
    ),
  );

  const playerCurrentTournamentHistory =
    await fetchPlayerCurrentTournamentHistory(player.phone_number);

  const { rsvpEnabled, playerRsvpEnabled } = await fetchFeatureFlags();
  const showRsvp = rsvpEnabled && playerRsvpEnabled;

  const onSubmit = async (
    todayTournamentId: string,
    isRegisterForTodayTournament: boolean,
  ) => {
    'use server';
    const todayDate = getTodayShortDate();
    await rsvpPlayerForDay(
      player.phone_number,
      todayDate,
      todayTournamentId,
      !isRegisterForTodayTournament,
      `/${params.userId}/${isAdminPlayer ? 'player_data' :'player_registration'}`,
    );
  };
  return (
    <PlayerPagePlayerRegistration
      player={player}
      todayTournaments={todayTournaments}
      onSubmit={onSubmit}
      rsvpCountsForTodayTournaments={rsvpCountsForTodayTournaments}
      playerCurrentTournamentHistory={playerCurrentTournamentHistory}
      showRsvp={showRsvp}
    />
  );
}
