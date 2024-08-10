'use client';

import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import TodayTournamentNameCardWrapper from '@/app/ui/client/TodayTournamentNameCardWrapper';
import RSVPAndArrivalCardWrapper from '@/app/ui/client/RSVPAndArrivalCardWrapper';
import { PlayerDB, PrizeInfoDB, TournamentDB } from '@/app/lib/definitions';
import FinalTablePlayers from '@/app/ui/client/FinalTablePlayers';
import RegisterSave from '@/app/ui/client/RegisterSave';
import PlayersPrizes from '@/app/ui/client/PlayersPrizes';
import TodayPlayersTable from '@/app/ui/client/TodayPlayersTable';

export default function CurrentTournamentPage({
  todayTournaments,
  params,
  finalTablePlayersContents,
  allPlayers,
  prizesInformation,
  rsvpEnabled,
  prizesContents,
}: {
  rsvpEnabled: boolean;
  todayTournaments: TournamentDB[];
  params: { userId: string };
    finalTablePlayersContents: Array<JSX.Element | null>;
  allPlayers: PlayerDB[];
  prizesInformation: PrizeInfoDB[];
  prizesContents: Array<JSX.Element | null>;
}) {
  if (todayTournaments.length === 0) {
    return null;
  }

  if (todayTournaments.length === 1) {
    const todayTournament = todayTournaments[0];

    return (
      <div className="full-width w-full">
        <RegisterSave players={allPlayers} />
        <div className="full-width flex w-full items-center justify-between">
          <TodayTournamentNameCardWrapper todayTournament={todayTournament} />
        </div>
        <div className="full-width flex w-full items-center justify-between">
          <RSVPAndArrivalCardWrapper todayTournament={todayTournament} />
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <FinalTablePlayers
            title="דירוג מנצחים"
            content={finalTablePlayersContents[0] as JSX.Element}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <PlayersPrizes
            title="פרסים"
            prizesContent={prizesContents[0] as JSX.Element}
          />
        </div>

        <TodayPlayersTable
          prizesInformation={prizesInformation}
          tournaments={todayTournaments}
          rsvpPlayersCount={todayTournament.rsvpForToday}
          isRsvpRequired={todayTournament.rsvp_required}
          allPlayers={allPlayers}
          userId={params.userId}
          rsvpEnabled={rsvpEnabled}
          tournamentId={todayTournament.id}
        />
      </div>
    );
  }

  return (
    <div className="rtl">
      <Tabs>
        <TabList >
          {todayTournaments.map((todayTournament) => (
            <Tab key={todayTournament.id} > {todayTournament.name}</Tab>
          ))}
        </TabList>

        {todayTournaments.map((todayTournament, index) => {
          return (
            <TabPanel key={todayTournament.id}>
              <div className="full-width w-full">
                <div style={{ position:'fixed', top: 5, left: 5, textAlign:'center', background:'orange', padding: '5px 10px', zIndex:99}}>{todayTournament.name}</div>
                <RegisterSave players={allPlayers} />
                <div className="full-width flex w-full items-center justify-between">
                  <TodayTournamentNameCardWrapper
                    todayTournament={todayTournament}
                  />
                </div>
                <div className="full-width flex w-full items-center justify-between">
                  <RSVPAndArrivalCardWrapper
                    todayTournament={todayTournament}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                  <FinalTablePlayers
                    title="דירוג מנצחים"
                    content={finalTablePlayersContents[index] as JSX.Element}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                  <PlayersPrizes
                    title="פרסים"
                    prizesContent={prizesContents[index] as JSX.Element}
                  />
                </div>

                <TodayPlayersTable
                  prizesInformation={prizesInformation}
                  tournaments={todayTournaments}
                  rsvpPlayersCount={todayTournament.rsvpForToday}
                  isRsvpRequired={todayTournament.rsvp_required}
                  allPlayers={allPlayers}
                  userId={params.userId}
                  rsvpEnabled={rsvpEnabled}
                  tournamentId={todayTournament.id}
                />
              </div>
            </TabPanel>
          );
        })}
      </Tabs>
    </div>
  );
}
