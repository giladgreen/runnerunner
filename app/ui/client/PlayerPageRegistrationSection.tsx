'use client';

import React from 'react';
import { PlayerDB, TournamentDB } from '@/app/lib/definitions';
import { getRSVPSForTheNextWeek } from '@/app/lib/clientUtils';

const PlayerPageRegistrationSection = ({
  player,
  thisWeekTournaments,
}: {
  player: PlayerDB;
  thisWeekTournaments: TournamentDB[];
})=> {
  const rsvpsForTheNextWeek = getRSVPSForTheNextWeek(
    thisWeekTournaments,
    player,
    true,
  );

  return (
      <div
        className="rtl rsvp-for-next-week"
      >
        { (rsvpsForTheNextWeek) ? (<>
          <div className="rtl header" >
            טורנירי השבוע הקרוב
          </div>
          <div className="user-tournament-rsvps">{rsvpsForTheNextWeek}</div>
        </>) : (<div className="rtl header" >
          <u>אין טורנירים נוספים השבוע</u>
        </div>)}
      </div>
  );
}

export default PlayerPageRegistrationSection;
