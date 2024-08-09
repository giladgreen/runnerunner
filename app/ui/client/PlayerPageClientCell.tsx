'use client';

import 'react-tabs/style/react-tabs.css';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { formatCurrency, formatCurrencyColor } from '@/app/lib/utils';
import Image from 'next/image';
import TournamentsHistoryTable from '@/app/ui/client/TournamentsHistoryTable';
import PlayersPrizesPage from '@/app/[userId]/prizes/PlayersPrizesPage';
import React from 'react';
import PlayerHistoryTable from '@/app/ui/client/PlayerHistoryTable';
import PlayerPageRegistrationSection from '@/app/ui/client/PlayerPageRegistrationSection';
import {LogDB, PlayerDB, PrizeDB, TournamentDB} from "@/app/lib/definitions";

export default function PlayerPageClientCell({
  player,
  rsvpEnabled,
  playerRsvpEnabled,
  todayTournaments,
  rsvpCountsForTodayTournaments,
  playerCurrentTournamentHistory,
  onSubmit,
  playerPrizes,
   prizesContents
}: {
  player: PlayerDB;
  rsvpEnabled: boolean;
  playerRsvpEnabled: boolean;
  todayTournaments: TournamentDB[];
  rsvpCountsForTodayTournaments: number[];
  playerCurrentTournamentHistory: LogDB[];
  onSubmit: (a: string, b: boolean) => void;
  playerPrizes: { chosenPrizes: PrizeDB[], deliveredPrizes: PrizeDB[], readyToBeDeliveredPrizes: PrizeDB[] };
  prizesContents:{ chosenPrizesContent: JSX.Element, deliveredPrizesContent: JSX.Element, readyToBeDeliveredPrizesContent: JSX.Element }

}) {
  const showRsvp = rsvpEnabled && playerRsvpEnabled;

  return (
    <div className="rtl" style={{ marginTop: 50}}>
      <Tabs>
        <TabList>
          <Tab key="home"> בית </Tab>
          {showRsvp && <Tab key="registrations"> רישום </Tab>}
          <Tab key="history"> היסטורית קרדיט </Tab>
          <Tab key="prizes"> פרסים </Tab>
        </TabList>
        <TabPanel key="home">
          <div>
            <Image
                src={player.image_url}
                alt={`${player.name}'s profile picture`}
                width={222}
                height={222}
            />
            <div
                className="truncate font-semibold"
                style={{margin: '2px 10px', zoom: 2}}
            >
              {player.name}
            </div>
            <div
                className="truncate font-semibold"
                style={{margin: '2px 10px', zoom: 1.4, color: 'blue'}}
            >
              {player.phone_number}{' '}
            </div>
            <div>
              <span style={{ fontSize:40}}>קרדיט:</span>
              <b style={{marginRight: 5}}>
                {player.balance < 0 ? 'חוב של' : ''}
              </b>
              <span
                  className="truncate font-semibold"
                  style={{
                    zoom: 2.2,
                    color: formatCurrencyColor(player.balance),
                  }}
              >
              <b> {formatCurrency(Math.abs(player.balance))}</b>
            </span>

            </div>
          </div>
        </TabPanel>
        {showRsvp && <TabPanel key="registrations">
          <div>
            <PlayerPageRegistrationSection
                player={player}
                todayTournaments={todayTournaments}
                onSubmit={onSubmit}
                rsvpCountsForTodayTournaments={rsvpCountsForTodayTournaments}
                playerCurrentTournamentHistory={playerCurrentTournamentHistory}
            />
          </div>
        </TabPanel>}
        <TabPanel key="history">
          <TournamentsHistoryTable player={player} />
          <PlayerHistoryTable player={player} />
        </TabPanel>
        <TabPanel key="prizes">
         <div style={{ marginTop: 30}}>
           <PlayersPrizesPage
               playerPrizes={playerPrizes}
               prizesContents={prizesContents}
               playerPage
           />
         </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}
