'use client';

import { PlayersTable} from '@/app/lib/definitions';
import {rsvpPlayerForDay} from "@/app/lib/actions";

export default function RSVPButton({
  player,
}: {
  player: PlayersTable;
}) {
    const now = new Date();
    const dayOfTheWeek = now.toLocaleString('en-us', { weekday: 'long' });
    const rsvpPropName = `${dayOfTheWeek.toLowerCase()}_rsvp`;
    // @ts-ignore
    const isRsvpForToday =  (player[rsvpPropName] as boolean);
    const icon =  isRsvpForToday ? '✅' : '🚫';
    return (
      <div onClick={() => rsvpPlayerForDay(player.phone_number, rsvpPropName, !isRsvpForToday)}>
          { icon }
      </div>
  );
}
