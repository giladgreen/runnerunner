'use client';

import React from 'react';
import { LogDB, PlayerDB, TournamentDB } from '@/app/lib/definitions';
import PlayerPageRegistrationSection from '@/app/ui/client/PlayerPageRegistrationSection';

export default function PlayerPagePlayerRegistration({
  player,
  showRsvp,
  todayTournaments,
  rsvpCountsForTodayTournaments,
  playerCurrentTournamentHistory,
  onSubmit,
}: {
  player: PlayerDB;
  showRsvp: boolean;
  todayTournaments: TournamentDB[];
  rsvpCountsForTodayTournaments: number[];
  playerCurrentTournamentHistory: LogDB[];
  onSubmit: (a: string, b: boolean) => void;
}) {
  return (
    <div className="rtl" style={{ marginTop: 50 }}>
      <div style={{ zoom: 2 }}>
        <u>
          <b>רישום</b>
        </u>
      </div>
      <div style={{ marginTop: 10 }}>
        {showRsvp ? (
          <div>
            <PlayerPageRegistrationSection
              player={player}
              todayTournaments={todayTournaments}
              onSubmit={onSubmit}
              rsvpCountsForTodayTournaments={rsvpCountsForTodayTournaments}
              playerCurrentTournamentHistory={playerCurrentTournamentHistory}
            />
          </div>
        ) : (
          <div>לא נתמך זמנית</div>
        )}
      </div>
    </div>
  );
}
