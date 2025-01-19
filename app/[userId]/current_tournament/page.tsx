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
import { PrizeDB, PrizeInfoDB } from '@/app/lib/definitions';

export default async function CurrentTournament({
  params,
}: {
  params: { userId: string };
}) {
  const user = await fetchUserById(params.userId);
  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;
  if (!isAdmin && !isWorker) {
    return <NoPermissionsPage />;
  }

  const dayOfTheWeek = getDayOfTheWeek();
  const date = getTodayShortDate();
  const [allPlayers, flags, rsvpAndArrivalData, todayPlayersPhoneNumbers] =
    await Promise.all([
      getAllPlayers(),
      fetchFeatureFlags(),
      fetchRSVPAndArrivalData(dayOfTheWeek),
      fetchTodayPlayersPhoneNumbers(),
    ]);

  const { todayTournaments } = rsvpAndArrivalData;
  const { rsvpEnabled, prizesEnabled } = flags;

  const refreshEnabled = user.refresh_enabled;
  let chosenPrizes: Array<PrizeDB> = [];
  let prizesInformation: Array<PrizeInfoDB> = [];
  if (prizesEnabled) {
    const [serverPlayersPrizes, servePrizesInformation] = await Promise.all([
      fetchPlayersPrizes(),
      fetchPrizesInfo(),
    ]);
    prizesInformation = servePrizesInformation;
    chosenPrizes = serverPlayersPrizes.chosenPrizes;
  }

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
          className="flex h-10 items-center rounded-lg  px-4  font-medium text-white transition-colors  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        >
          <div className="link-text">
            <b> לשינוי הגדרות טורניר</b>
          </div>
        </a>
      </div>
    );
  }

  const finalTablePlayersContents: Array<JSX.Element | null> =
    await Promise.all(
      todayTournaments.map((t) =>
        getFinalTablePlayersContent(
          prizesEnabled,
          date,
          t.id,
          false,
          params.userId,
        ),
      ),
    );

  const playersPrizes = chosenPrizes.filter((p) =>
    todayPlayersPhoneNumbers.includes(p.phone_number),
  );

  const prizesContents: Array<JSX.Element | null> = prizesEnabled
    ? await Promise.all(
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
      )
    : [];

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
      refreshEnabled={refreshEnabled}
    />
  );
}
