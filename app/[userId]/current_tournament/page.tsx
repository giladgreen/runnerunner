import TodayPlayersTable from '@/app/ui/client/TodayPlayersTable';
import {
  fetchFeatureFlags,
  fetchPrizesInfo,
  fetchTournaments,
  fetchUserById,
  getAllPlayers,
} from '@/app/lib/data';
import FinalTablePlayers from '@/app/ui/client/FinalTablePlayers';
import PlayersPrizes from '@/app/ui/client/PlayersPrizes';
import RSVPAndArrivalCardWrapper from '@/app/ui/client/RSVPAndArrivalCardWrapper';
import TodayTournamentNameCardWrapper from '@/app/ui/client/TodayTournamentNameCardWrapper';
import React from 'react';
import RegisterSave from '@/app/ui/client/RegisterSave';

export default async function CurrentTournament({
  params,
}: {
  params: { userId: string };
}) {
  const user = await fetchUserById(params.userId);
  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;
  const allPlayers = await getAllPlayers();

  if (!isAdmin && !isWorker) {
    return (
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl">
            <b>
              <u>You do not have permissions to see this page</u>
            </b>
          </h1>
        </div>
      </div>
    );
  }

  const prizesInformation = await fetchPrizesInfo();
  const tournaments = await fetchTournaments();
  const { prizesEnabled, placesEnabled, rsvpEnabled } =
    await fetchFeatureFlags();

  const now = new Date();
  const dayOfTheWeek = now.toLocaleString('en-us', { weekday: 'long' });
  const todayTournament = tournaments.find(
    (tournament) => tournament.day === dayOfTheWeek,
  );
  const isRsvpRequired = todayTournament!.rsvp_required;

  // @ts-ignore
  const rsvpPlayers = allPlayers.filter((player) => player.rsvpForToday);
  const rsvpPlayersCount = rsvpPlayers.length;

  return (
    <div className="full-width w-full">
      <RegisterSave players={allPlayers} />
      <div className="full-width flex w-full items-center justify-between">
        <TodayTournamentNameCardWrapper params={params} />
      </div>
      <div className="full-width flex w-full items-center justify-between">
        <RSVPAndArrivalCardWrapper params={params} />
      </div>
      {placesEnabled && (
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <FinalTablePlayers title="Places" params={params} />
        </div>
      )}
      {prizesEnabled && (
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <PlayersPrizes title="Players Prizes" showOnlyToday params={params} />
        </div>
      )}

      <TodayPlayersTable
        prizesInformation={prizesInformation}
        tournaments={tournaments}
        rsvpPlayersCount={rsvpPlayersCount}
        isRsvpRequired={isRsvpRequired}
        allPlayers={allPlayers}
        userId={params.userId}
        prizesEnabled={prizesEnabled}
        placesEnabled={placesEnabled}
        rsvpEnabled={rsvpEnabled}
      />
    </div>
  );
}
