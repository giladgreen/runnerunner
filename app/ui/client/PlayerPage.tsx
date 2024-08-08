import 'react-tabs/style/react-tabs.css';
import { formatCurrency, formatCurrencyColor } from '@/app/lib/utils';
import {
  fetchFeatureFlags,
  fetchPlayerByUserId,
  fetchPlayerCurrentTournamentHistory,
  fetchRsvpCountForTodayTournament,
  fetchTournamentsByDay,
} from '@/app/lib/data';
import Image from 'next/image';
import TournamentsHistoryTable from '@/app/ui/client/TournamentsHistoryTable';
import PlayersPrizesPage from '@/app/[userId]/prizes/PlayersPrizesPage';
import React from 'react';
import PlayerHistoryTable from '@/app/ui/client/PlayerHistoryTable';
import PlayerPageRegistrationSection from '@/app/ui/client/PlayerPageRegistrationSection';
import { rsvpPlayerForDay } from '@/app/lib/actions';

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

  return (
    <div
      className="rtl flex-grow p-6 md:overflow-y-auto md:p-12"
      style={{ marginTop: 20 }}
    >
      <div className="flex">
        <div style={{ marginLeft: 20 }}>
          <Image
            src={player.image_url}
            alt={`${player.name}'s profile picture`}
            width={222}
            height={222}
          />
        </div>
        <div>
          <div
            className="truncate font-semibold"
            style={{ margin: '2px 10px', zoom: 2 }}
          >
            {player.name}
          </div>
          <div
            className="truncate font-semibold"
            style={{ margin: '2px 10px', zoom: 1.4, color: 'blue' }}
          >
            {player.phone_number}{' '}
          </div>
        </div>
      </div>
      <div>
        <div>
          <span
            className="truncate font-semibold"
            style={{
              zoom: 2.2,
              color: formatCurrencyColor(player.balance),
            }}
          >
            <span>קרדיט:</span>
            <b style={{ marginRight: 5 }}>
              {player.balance < 0 ? 'חוב של' : ''}
            </b>
            <b> {formatCurrency(Math.abs(player.balance))}</b>
          </span>
        </div>
        {separator}
        {showRsvp && (
          <div style={{ marginBottom: 10, borderBottom: '2px solid black' }}>
            <PlayerPageRegistrationSection
              player={player}
              todayTournaments={todayTournaments}
              onSubmit={onSubmit}
              rsvpCountsForTodayTournaments={rsvpCountsForTodayTournaments}
              playerCurrentTournamentHistory={playerCurrentTournamentHistory}
            />
          </div>
        )}

        {separator}
        <div className="rtl">
          <b>
            <u>הסטוריה</u>
          </b>
        </div>

        <TournamentsHistoryTable player={player} />

        <div style={{ width: 100, height: 10, margin: '10px 0' }}></div>
        <PlayersPrizesPage
          playerPhone={player.phone_number}
          playerPage={playerPage}
        />
        <div style={{ width: 100, height: 10, margin: '10px 0' }}></div>
        <PlayerHistoryTable player={player} />
      </div>
    </div>
  );
}
