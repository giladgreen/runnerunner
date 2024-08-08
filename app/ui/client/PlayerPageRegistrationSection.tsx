'use client';

import 'react-tabs/style/react-tabs.css';

import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { rsvpPlayerForDay } from '@/app/lib/actions';
import {
  LogDB,
  PlayerDB,
  TournamentDB,
  TRANSLATIONS,
} from '@/app/lib/definitions';

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
  return (
    <Tabs className="rtl">
      <TabList>
        {todayTournaments.map((todayTournament) => (
          <Tab key={todayTournament.id}> {todayTournament.name}</Tab>
        ))}
      </TabList>
      {todayTournaments.map((todayTournament, index) => {
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
          // @ts-ignore
          TRANSLATIONS[todayTournament.day]
        } -  ${
          !todayHasATournament ? NO_TOURNAMENT_TODAY : todayTournament.name
        }`;

        // @ts-ignore
        const isRegisterForTodayTournament =
          player.rsvpForToday === todayTournament.id;
        const isFull = rsvpCountsForTodayTournaments[index] >= max_players;

        const registrationStatus = isFull
          ? isRegisterForTodayTournament
            ? playerArrived
              ? YOU_ARE_ALREADY_IN_THE_GAME
              : YOU_ARE_ALREADY_REGISTERED
            : NO_MORE_SPOTS
          : isRegisterForTodayTournament
          ? YOU_ARE_ALREADY_REGISTERED
          : YOU_ARE_NOT_REGISTERED;

        // const onSubmit = async (_formData: FormData) => {
        //     'use server';
        //     const todayDate = new Date().toISOString().slice(0, 10);
        //     await rsvpPlayerForDay(
        //         player.phone_number,
        //         todayDate,
        //         todayTournament.id,
        //         !isRegisterForTodayTournament,
        //         `/${params.userId}`,
        //     );
        // };

        return (
          <TabPanel key={todayTournament.id}>
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
                        נותרו עוד{' '}
                        {max_players - rsvpCountsForTodayTournaments[index]}{' '}
                        מקומות
                      </div>

                      <form
                        action={() =>
                          onSubmit(
                            todayTournament.id,
                            isRegisterForTodayTournament,
                          )
                        }
                      >
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
          </TabPanel>
        );
      })}
    </Tabs>
  );
}
