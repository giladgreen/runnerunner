'use client';

import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import TodayTournamentNameCardWrapper from '@/app/ui/client/TodayTournamentNameCardWrapper';
import RSVPAndArrivalCardWrapper from '@/app/ui/client/RSVPAndArrivalCardWrapper';
import { TournamentDB } from '@/app/lib/definitions';
import FinalTablePlayers from '@/app/ui/client/FinalTablePlayers';

export default function AdminHomePage({
  todayTournaments,
  contents,
}: {
  todayTournaments: TournamentDB[];
  contents: Array<JSX.Element | null>;
}) {
  if (todayTournaments.length === 0) {
    return null;
  }

  if (todayTournaments.length === 1) {
    const todayTournament = todayTournaments[0];
    const todayHasTournament =
      todayTournament.max_players > 0 || !todayTournament.rsvp_required;

    return (
      <>
        <div className="full-width flex w-full items-center justify-between">
          <TodayTournamentNameCardWrapper todayTournament={todayTournament} />
        </div>
        <div
          key={todayTournament.id}
          style={{ marginBottom: 10, borderBottom: '2px solid black' }}
        >
          {todayHasTournament && (
            <RSVPAndArrivalCardWrapper
              todayTournament={todayTournament as TournamentDB}
            />
          )}
          {todayHasTournament && (
            <div style={{ marginTop: 40 }}>
              <FinalTablePlayers
                title="דירוג טורניר נוכחי"
                content={contents[0] as JSX.Element}
              />
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="rtl">
      <Tabs>
        <TabList>
          {todayTournaments.map((todayTournament) => (
            <Tab key={todayTournament.id}> {todayTournament.name}</Tab>
          ))}
        </TabList>

        {todayTournaments.map((todayTournament, index) => {
          const todayHasTournament =
            todayTournament.max_players > 0 || !todayTournament.rsvp_required;

          return (
            <TabPanel key={todayTournament.id}>
              <div className="full-width flex w-full items-center justify-between">
                <TodayTournamentNameCardWrapper
                  todayTournament={todayTournament}
                />
              </div>
              <div
                key={todayTournament.id}
                style={{ marginBottom: 10, borderBottom: '2px solid black' }}
              >
                {todayHasTournament && (
                  <RSVPAndArrivalCardWrapper
                    todayTournament={todayTournament as TournamentDB}
                  />
                )}
                {todayHasTournament && (
                  <div style={{ marginTop: 40 }}>
                    <FinalTablePlayers
                      title="דירוג טורניר נוכחי"
                      content={contents[index] as JSX.Element}
                    />
                  </div>
                )}
              </div>
            </TabPanel>
          );
        })}
      </Tabs>
    </div>
  );
}
