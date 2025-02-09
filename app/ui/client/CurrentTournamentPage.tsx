'use client';

import React, { useEffect } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import TodayTournamentNameCardWrapper from '@/app/ui/client/TodayTournamentNameCardWrapper';
import RSVPAndArrivalCardWrapper from '@/app/ui/client/RSVPAndArrivalCardWrapper';
import { PlayerDB, PrizeInfoDB, TournamentDB } from '@/app/lib/definitions';
import FinalTablePlayers from '@/app/ui/client/FinalTablePlayers';
import RegisterSave from '@/app/ui/client/RegisterSave';
import PlayersPrizes from '@/app/ui/client/PlayersPrizes';
import TodayPlayersTable from '@/app/ui/client/TodayPlayersTable';
import CssChange from '@/app/ui/client/CssChange';

export default function CurrentTournamentPage({
  todayTournaments,
  params,
  finalTablePlayersContents,
  allPlayers,
  prizesInformation,
  rsvpEnabled,
  prizesEnabled,
  prizesContents,
  refreshEnabled,
}: {
  refreshEnabled: boolean;
  rsvpEnabled: boolean;
  prizesEnabled: boolean;
  todayTournaments: TournamentDB[];
  params: { userId: string };
  finalTablePlayersContents: Array<JSX.Element | null>;
  allPlayers: PlayerDB[];
  prizesInformation: PrizeInfoDB[];
  prizesContents: Array<JSX.Element | null>;
}) {
  useEffect(() => {
    const id = setInterval(async () => {
      if (!refreshEnabled) {
        return;
      }
      window.location.reload();
    }, 30_000);

    return () => clearInterval(id);
  }, []);

  if (todayTournaments.length === 0) {
    return null;
  }

  if (todayTournaments.length === 1) {
    const todayTournament = todayTournaments[0];

    return (
      <div className="full-width w-full">
        <CssChange/>
        <RegisterSave players={allPlayers} />
        <div className="full-width flex w-full items-center justify-between">
          <TodayTournamentNameCardWrapper todayTournament={todayTournament} />
        </div>
        <div className="full-width flex w-full items-center justify-between">
          <RSVPAndArrivalCardWrapper
            todayTournament={todayTournament}
            incomeAsLink={true}
            userId={params.userId}
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <FinalTablePlayers
            title="דירוג מנצחים"
            content={finalTablePlayersContents[0] as JSX.Element}
          />
        </div>

        {prizesEnabled && (
          <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
            <PlayersPrizes
              title="פרסים"
              prizesContent={prizesContents[0] as JSX.Element}
            />
          </div>
        )}

        <TodayPlayersTable
          prizesInformation={prizesInformation}
          tournaments={todayTournaments}
          rsvpPlayersCount={todayTournament.rsvpForToday}
          isRsvpRequired={todayTournament.rsvp_required}
          allPlayers={allPlayers}
          userId={params.userId}
          rsvpEnabled={rsvpEnabled}
          prizesEnabled={prizesEnabled}
          tournamentId={todayTournament.id}
        />
      </div>
    );
  }

  return (
    <div className="rtl">
      <CssChange/>
      <Tabs>
        <TabList>
          {todayTournaments.map((todayTournament) => (
            <Tab key={todayTournament.id}> {todayTournament.name}</Tab>
          ))}
        </TabList>

        {todayTournaments.map((todayTournament, index) => {
          return (
            <TabPanel key={todayTournament.id}>
              <div className="full-width w-full">
                <div
                  className="current_tournament_fly_card"
                >
                  {todayTournament.name}
                </div>
                <RegisterSave players={allPlayers}/>
                <div className="full-width flex w-full items-center justify-between">
                  <TodayTournamentNameCardWrapper
                      todayTournament={todayTournament}
                  />
                </div>
                <div className="full-width flex w-full items-center justify-between">
                  <RSVPAndArrivalCardWrapper
                    todayTournament={todayTournament}
                    incomeAsLink={true}
                    userId={params.userId}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                  <FinalTablePlayers
                    title="דירוג מנצחים"
                    content={finalTablePlayersContents[index] as JSX.Element}
                  />
                </div>

                {prizesEnabled && (
                  <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                    <PlayersPrizes
                      title="פרסים"
                      prizesContent={prizesContents[index] as JSX.Element}
                    />
                  </div>
                )}

                <TodayPlayersTable
                  prizesInformation={prizesInformation}
                  tournaments={todayTournaments}
                  rsvpPlayersCount={todayTournament.rsvpForToday}
                  isRsvpRequired={todayTournament.rsvp_required}
                  allPlayers={allPlayers}
                  userId={params.userId}
                  rsvpEnabled={rsvpEnabled}
                  prizesEnabled={prizesEnabled}
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
