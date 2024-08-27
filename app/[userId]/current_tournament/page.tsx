import {
  fetchFeatureFlags,
  fetchPlayersPrizes,
  fetchPrizesInfo,
  fetchRSVPAndArrivalData,
  fetchTodayPlayersPhoneNumbers,
  fetchUserById,
  getAllPlayers,
} from '@/app/lib/data';

import TodayTournamentNameCardWrapper from '@/app/ui/client/TodayTournamentNameCardWrapper';
import React from 'react';
import RegisterSave from '@/app/ui/client/RegisterSave';
import {
  getFinalTablePlayersContent,
  getPlayersPrizesContent,
} from '@/app/ui/client/helpers';
import CurrentTournamentPage from '@/app/ui/client/CurrentTournamentPage';
import NoPermissionsPage from '@/app/ui/client/NoPermissionsPage';
import { getDayOfTheWeek, getTodayShortDate } from '@/app/lib/serverDateUtils';

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
    return <NoPermissionsPage />;
  }

  const prizesInformation = await fetchPrizesInfo();

  const { rsvpEnabled, prizesEnabled } = await fetchFeatureFlags();
  const dayOfTheWeek = getDayOfTheWeek();

  const { todayTournaments } = await fetchRSVPAndArrivalData(dayOfTheWeek);

  const noTournamentsToday =
    todayTournaments.length === 0 ||
    !todayTournaments.find((t) => t.max_players > 0 || !t.rsvp_required);

  if (noTournamentsToday) {
    return (
      <div className="full-width w-full">
        <RegisterSave players={allPlayers} />
        <div className="full-width flex w-full items-center justify-between">
          <TodayTournamentNameCardWrapper todayTournament={null} />
        </div>
        <a
          href={`/${params.userId}/configurations/tournaments`}
          className="flex h-10 items-center rounded-lg bg-blue-400 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        >
          <div style={{ textAlign: 'center', width: '100%' }}>
            <b> לשינוי הגדרות טורניר</b>
          </div>
        </a>
      </div>
    );
  }

  const date = getTodayShortDate();
  const finalTablePlayersContents: Array<JSX.Element | null> =
    await Promise.all(
      todayTournaments.map((t) =>
        getFinalTablePlayersContent(prizesEnabled, date, t.id, false, params.userId),
      ),
    );

  const todayPlayersPhoneNumbers = await fetchTodayPlayersPhoneNumbers();

  const { chosenPrizes } = await fetchPlayersPrizes();

  const playersPrizes = chosenPrizes.filter((p) =>
    todayPlayersPhoneNumbers.includes(p.phone_number),
  );

  const prizesContents: Array<JSX.Element | null> = await Promise.all(
    todayTournaments.map((todayTournament) =>
      getPlayersPrizesContent(
        playersPrizes.filter(
          (prize) =>
            allPlayers.find(
              (player) => player.phone_number === prize.phone_number,
            )?.rsvpForToday === todayTournament.id,
        ),
        prizesInformation,
        todayTournament.id,
        false,
        params.userId,
        true,
      ),
    ),
  );

  return (
    <CurrentTournamentPage
      prizesContents={prizesContents}
      prizesEnabled={prizesEnabled}
      rsvpEnabled={rsvpEnabled}
      prizesInformation={prizesInformation}
      allPlayers={allPlayers}
      params={params}
      todayTournaments={todayTournaments}
      finalTablePlayersContents={finalTablePlayersContents}
    />
  );
}
