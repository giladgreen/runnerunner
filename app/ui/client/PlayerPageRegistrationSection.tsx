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
  if (!rsvpsForTheNextWeek === null) {
    <div>אין טורנירים נוספים השבוע</div>;
  }

  return (
    <div>
      <div
        className="rtl rsvp-for-next-week"
      >
        <img src="/runner-big.png"/>
        <div className="rtl" style={{ textAlign: 'right' }}>
          <u>אישורי הגעה לשבוע הקרוב</u>
        </div>
        <div>{rsvpsForTheNextWeek}</div>
      </div>
    </div>
  );
}
