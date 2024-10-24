'use client';

import React from 'react';
import { PlayerDB, TournamentDB } from '@/app/lib/definitions';
import PlayerPageRegistrationSection from '@/app/ui/client/PlayerPageRegistrationSection';

export default function PlayerPagePlayerRegistration({
  player,
  showRsvp,
  thisWeekTournaments,
}: {
  player: PlayerDB;
  showRsvp: boolean;
  thisWeekTournaments: TournamentDB[];
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
              thisWeekTournaments={thisWeekTournaments}
            />
          </div>
        ) : (
          <div>לא נתמך זמנית</div>
        )}
      </div>
    </div>
  );
}
