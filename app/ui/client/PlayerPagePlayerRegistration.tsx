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
    <div className="rsvp-for-next-week-page" >
      <div  className="rtl">
        <div >
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
    </div>
  );
}
