'use client';

import React from 'react';
import { PlayerDB, TournamentDB } from '@/app/lib/definitions';
import { getRSVPSForTheNextWeek } from '@/app/lib/clientUtils';

export default function PlayerPageRegistrationSection({
  player,
  thisWeekTournaments,
}: {
  player: PlayerDB;
  thisWeekTournaments: TournamentDB[];
}) {
  const rsvpsForTheNextWeek = getRSVPSForTheNextWeek(
    thisWeekTournaments,
    player,
    true,
  );

  return (
    <div>
      <div
        className="rtl rsvp-for-next-week"
      >
        <img src="/runner-big.png"/>
        { (rsvpsForTheNextWeek) ? (<>
          <div className="rtl" style={{ textAlign: 'center' }}>
            <u>טורנירי השבוע הקרוב</u>
          </div>
          <div>{rsvpsForTheNextWeek}</div>
        </>) : (<div className="rtl" style={{ textAlign: 'center' }}>
          <u>אין טורנירים נוספים השבוע</u>
        </div>)}

      </div>
    </div>
  );
}
