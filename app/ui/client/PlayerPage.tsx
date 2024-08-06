import { formatCurrency, formatCurrencyColor } from '@/app/lib/utils';
import {
  fetchFeatureFlags,
  fetchPlayerByUserId,
  fetchRsvpCountForTodayTournament,
  fetchTournamentByDay,
  fetchPlayerCurrentTournamentHistory,
} from '@/app/lib/data';
import Image from 'next/image';
import HistoryTable from '@/app/ui/client/HistoryTable';
import { rsvpPlayerForDay } from '@/app/lib/actions';
import TournamentsHistoryTable from '@/app/ui/client/TournamentsHistoryTable';
import { TRANSLATIONS } from '@/app/lib/definitions';
import PlayersPrizesPage from '@/app/[userId]/prizes/PlayersPrizesPage';
import Card from '@/app/ui/client/Card';
import { PlayerSetupNameModal } from '@/app/ui/client/PlayerSetupNameModal';
import React from 'react';
import PlayerHistoryTable from '@/app/ui/client/PlayerHistoryTable';

const NO_NEED_FOR_RSVP = 'אין צורך ברישום לטורניר של היום';
const YOU_ARE_ALREADY_REGISTERED = 'אתה רשום לטורניר של היום';
const YOU = 'אתה';
const ARE_NOT = 'לא';
const REGISTERED_FOR_TODAY = 'רשום לטורניר של היום';
const YOU_ARE_NOT_REGISTERED = (
  <span>
    {YOU}
    <b> {ARE_NOT}</b> {REGISTERED_FOR_TODAY}
  </span>
);
const NO_TOURNAMENT_TODAY = 'אין טורניר היום';
const NO_MORE_SPOTS = 'אין יותר מקום לטורניר של היום';
const CLICK_HERE_TO_UNREGISTER = 'לביטול הרשמה לחץ כאן';
const CLICK_HERE_TO_REGISTER = 'לרישום לחץ כאן';
const YOU_ARE_ALREADY_IN_THE_GAME = 'אתה כבר במשחק';

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
  const todayTournament = await fetchTournamentByDay();
  const playerCurrentTournamentHistory =
    await fetchPlayerCurrentTournamentHistory(player.phone_number);
  const playerArrived =
    playerCurrentTournamentHistory.filter(
      ({ type, change }) => type !== 'credit_to_other' && change !== 0,
    ).length > 0;

  const rsvpCountForTodayTournament = await fetchRsvpCountForTodayTournament();

  const { rsvp_required, max_players } = todayTournament;

  const todayHasATournament =
    todayTournament && (!rsvp_required || max_players > 0);
  // @ts-ignore
  const todayTournamentData = `${
    // @ts-ignore
    TRANSLATIONS[todayTournament.day]
  } -  ${!todayHasATournament ? NO_TOURNAMENT_TODAY : todayTournament.name}`;

  // @ts-ignore
  const isRegisterForTodayTournament = player.rsvpForToday;
  const isFull = rsvpCountForTodayTournament >= max_players;

  const separator = <hr style={{ marginTop: 20, marginBottom: 20 }} />;

  const registrationStatus = isFull
    ? isRegisterForTodayTournament
      ? playerArrived
        ? YOU_ARE_ALREADY_IN_THE_GAME
        : YOU_ARE_ALREADY_REGISTERED
      : NO_MORE_SPOTS
    : isRegisterForTodayTournament
    ? YOU_ARE_ALREADY_REGISTERED
    : YOU_ARE_NOT_REGISTERED;

  const onSubmit = async (_formData: FormData) => {
    'use server';
    const todayDate = new Date().toISOString().slice(0, 10);
    await rsvpPlayerForDay(
      player.phone_number,
      todayDate,
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
          <div>
            <div
              style={{
                zoom: 1.4,
                width: '100%',
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              <b>{todayTournamentData}</b>
            </div>

            {todayHasATournament && (
              <div>
                <div
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    marginBottom: 20,
                    background: isRegisterForTodayTournament
                      ? 'rgb(187 247 208)'
                      : 'rgb(252 165 165)',
                  }}
                >
                  <b>
                    {!rsvp_required ? NO_NEED_FOR_RSVP : registrationStatus}
                  </b>
                </div>

                {rsvp_required && !playerArrived && (
                  <div
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        marginBottom: 10,
                        color: isRegisterForTodayTournament
                          ? 'transparent'
                          : 'black',
                      }}
                    >
                      נותרו עוד {max_players - rsvpCountForTodayTournament}{' '}
                      מקומות
                    </div>

                    <form action={onSubmit}>
                      <button
                        style={{
                          border: '1px solid black',
                          padding: 5,
                          margin: 5,
                          borderRadius: 4,
                          background: isRegisterForTodayTournament
                            ? 'rgb(252 165 165)'
                            : 'rgb(187 247 208)',
                        }}
                      >
                        {isRegisterForTodayTournament
                          ? CLICK_HERE_TO_UNREGISTER
                          : CLICK_HERE_TO_REGISTER}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
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
