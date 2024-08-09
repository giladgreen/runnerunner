import {
  fetchFeatureFlags,
  fetchPlayerByUserId,
  fetchPlayerCurrentTournamentHistory, fetchPlayersPrizes, fetchPrizesInfo,
  fetchRsvpCountForTodayTournament,
  fetchTournamentsByDay,
} from '@/app/lib/data';

import React from 'react';

import { rsvpPlayerForDay } from '@/app/lib/actions';
import PlayerPageClientCell from "@/app/ui/client/PlayerPageClientCell";
import { getPlayersPrizesContents} from "@/app/ui/client/helpers";

export default async function PlayerPage({
  params,
  playerPage,
}: {
  params: { userId: string };
  playerPage?: boolean;
}) {
  const player = await fetchPlayerByUserId(params.userId);
  if (!player) {
    return (
      <div
        className="rtl flex h-screen flex-col md:flex-row md:overflow-hidden"
        style={{ marginTop: 30, textAlign: 'center' }}
      >
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          <div>אין מידע עבור שחקן זה</div>
          <div style={{ marginTop: 120 }}>
            לרישום לטורניר אנא פנה אלינו בוואסאפ
          </div>
          <div
            className="flex flex-grow"
            style={{ marginTop: 5, textAlign: 'center', marginRight: 70 }}
          >
            <div style={{ marginTop: 3 }}>050-8874068</div>
            <img src="/whatsapp.png" width={50} height={50} alt="runner" />
          </div>
        </div>
      </div>
    );
  }
  const { rsvpEnabled, playerRsvpEnabled } = await fetchFeatureFlags();
  const showRsvp = rsvpEnabled && playerRsvpEnabled;
  const todayTournaments = await fetchTournamentsByDay();
  const rsvpCountsForTodayTournaments = await Promise.all(
    todayTournaments.map((todayTournament) =>
      fetchRsvpCountForTodayTournament(todayTournament.id),
    ),
  );

  const playerCurrentTournamentHistory =
    await fetchPlayerCurrentTournamentHistory(player.phone_number);

  const separator = <hr style={{ marginTop: 20, marginBottom: 20 }} />;

  const onSubmit = async (
    todayTournamentId: string,
    isRegisterForTodayTournament: boolean,
  ) => {
    'use server';
    const todayDate = new Date().toISOString().slice(0, 10);
    await rsvpPlayerForDay(
      player.phone_number,
      todayDate,
      todayTournamentId,
      !isRegisterForTodayTournament,
      `/${params.userId}`,
    );
  };
  const playerPrizes = await fetchPlayersPrizes(player?.phone_number);
  const prizesInformation = await fetchPrizesInfo();
  const { chosenPrizes, deliveredPrizes, readyToBeDeliveredPrizes } = playerPrizes;
  const prizesContents = await getPlayersPrizesContents(
      chosenPrizes,
      deliveredPrizes,
      readyToBeDeliveredPrizes,
      prizesInformation,
      null,
      false,
  );


  return (
    <div className="rtl" style={{ marginTop:20}}>
      <PlayerPageClientCell
          player={player}
          rsvpEnabled={rsvpEnabled}
          playerRsvpEnabled={playerRsvpEnabled}
          todayTournaments={todayTournaments}
          rsvpCountsForTodayTournaments={rsvpCountsForTodayTournaments}
          playerCurrentTournamentHistory={playerCurrentTournamentHistory}
          onSubmit={onSubmit}
          playerPrizes={playerPrizes}
          prizesContents={prizesContents}
      />
    </div>
  );
}
