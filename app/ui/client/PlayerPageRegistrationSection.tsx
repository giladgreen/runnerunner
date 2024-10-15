'use client';

import React, { useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import {
  LogDB,
  PlayerDB,
  TournamentDB,
  TRANSLATIONS,
} from '@/app/lib/definitions';
import { formatCurrency } from '@/app/lib/utils';
import Spinner from '@/app/ui/client/Spinner';

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

export function SingleTournament({
  showingTabs,
  onSubmit,
  index,
  todayTournament,
  playerCurrentTournamentHistory,
  player,
  rsvpCountsForTodayTournaments,
}: {
  showingTabs: boolean;
  onSubmit: (a: string, b: boolean) => void;
  index: number;
  rsvpCountsForTodayTournaments: number[];
  player: PlayerDB;
  todayTournament: TournamentDB;
  playerCurrentTournamentHistory: LogDB[];
}) {
  const [pending, setPending] = useState(false);

  const { rsvp_required, max_players } = todayTournament;
  const playerArrived =
    playerCurrentTournamentHistory.filter(
      ({ type, change, tournament_id }) =>
        type !== 'credit_to_other' &&
        change !== 0 &&
        tournament_id === todayTournament.id,
    ).length > 0;

  const todayHasATournament =
    todayTournament && (!rsvp_required || max_players > 0);
  // @ts-ignore
  const todayTournamentData = `${
    !todayHasATournament ? NO_TOURNAMENT_TODAY : todayTournament.name
  }`;

  // @ts-ignore
  const isRegisterForTodayTournament =
    player.rsvpForToday === todayTournament.id;
  const isFull = rsvpCountsForTodayTournaments[index] >= max_players;

  let registrationStatus = '';
  const green = 'rgb(187 247 208)';
  const red = 'rgb(252 165 165)';
  let registrationStatusBackgroundColor = green;
  let registrationActionBackgroundColor = red;
  if (playerArrived) {
    registrationStatus = YOU_ARE_ALREADY_IN_THE_GAME;
  } else if (!rsvp_required) {
    registrationStatus = NO_NEED_FOR_RSVP;
  } else {
    if (isFull) {
      if (isRegisterForTodayTournament) {
        registrationStatus = YOU_ARE_ALREADY_REGISTERED;
      } else {
        registrationStatus = NO_MORE_SPOTS;
        registrationStatusBackgroundColor = red;
        registrationActionBackgroundColor = green;
      }
    } else {
      if (isRegisterForTodayTournament) {
        registrationStatus = YOU_ARE_ALREADY_REGISTERED;
      } else {
        // @ts-ignore
        registrationStatus = YOU_ARE_NOT_REGISTERED;
        registrationStatusBackgroundColor = red;
        registrationActionBackgroundColor = green;
      }
    }
  }

  const placesLeft = max_players - rsvpCountsForTodayTournaments[index];
  return (
    <div>
      {!showingTabs && (
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
      )}

      {todayHasATournament && (
        <div>
          <div style={{ marginBottom: 20, marginTop: 10 }}>
            <div>
              כניסה:
              <b> {formatCurrency(todayTournament.buy_in)}</b>
            </div>
            <div>
              כניסה נוספת:
              <b> {formatCurrency(todayTournament.re_buy)}</b>
            </div>
          </div>
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              zoom: 1.3,
              marginBottom: 20,
              background: registrationStatusBackgroundColor,
            }}
          >
            <b>{registrationStatus}</b>
          </div>

          {rsvp_required && !playerArrived && (
            <div
              style={{
                width: '98%',
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              {placesLeft < 20 && (
                <div
                  style={{
                    marginBottom: 10,
                    color: isRegisterForTodayTournament
                      ? 'transparent'
                      : 'black',
                  }}
                >
                  נותרו עוד <b> {placesLeft} </b>
                  מקומות
                </div>
              )}

              <form
                action={() => {
                  setPending(true);
                  setTimeout(() => {
                    setPending(false);
                  }, 1500);
                  setTimeout(() => {
                    onSubmit(todayTournament.id, isRegisterForTodayTournament);
                  }, 10);
                }}
              >
                {pending && (
                  <Spinner size={90} style={{ marginRight: '35vw' }} />
                )}
                {!pending && (
                  <button
                    style={{
                      border: '1px solid black',
                      padding: 15,
                      zoom: 1.6,
                      margin: 5,
                      borderRadius: 4,
                      background: registrationActionBackgroundColor,
                    }}
                  >
                    {isRegisterForTodayTournament
                      ? CLICK_HERE_TO_UNREGISTER
                      : CLICK_HERE_TO_REGISTER}
                  </button>
                )}
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PlayerPageRegistrationSection({
  player,
  todayTournaments,
  rsvpCountsForTodayTournaments,
  playerCurrentTournamentHistory,
  onSubmit,
}: {
  onSubmit: (a: string, b: boolean) => void;
  player: PlayerDB;
  playerCurrentTournamentHistory: LogDB[];
  todayTournaments: TournamentDB[];
  rsvpCountsForTodayTournaments: number[];
}) {
  if (todayTournaments.length < 2) {
    return (
      <SingleTournament
        showingTabs={false}
        onSubmit={onSubmit}
        index={0}
        todayTournament={todayTournaments[0]}
        playerCurrentTournamentHistory={playerCurrentTournamentHistory}
        player={player}
        rsvpCountsForTodayTournaments={rsvpCountsForTodayTournaments}
      />
    );
  }

  return (
    <div>
      <div>
        <b>
          {
            // @ts-ignore
            TRANSLATIONS[todayTournaments[0].day]
          }
        </b>
      </div>
      <Tabs className="rtl" style={{ marginTop: 20 }}>
        <TabList>
          {todayTournaments.map((todayTournament) => (
            <Tab key={todayTournament.id}> {todayTournament.name}</Tab>
          ))}
        </TabList>
        {todayTournaments.map((todayTournament, index) => {
          return (
            <TabPanel key={todayTournament.id}>
              <SingleTournament
                showingTabs
                onSubmit={onSubmit}
                index={index}
                todayTournament={todayTournament}
                playerCurrentTournamentHistory={playerCurrentTournamentHistory}
                player={player}
                rsvpCountsForTodayTournaments={rsvpCountsForTodayTournaments}
              />
            </TabPanel>
          );
        })}
      </Tabs>
    </div>
  );
}
