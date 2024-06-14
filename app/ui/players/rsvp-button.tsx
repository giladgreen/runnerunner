'use client';

import { PlayerDB} from '@/app/lib/definitions';
import {rsvpPlayerForDay} from "@/app/lib/actions";

export default function RSVPButton({
  player,
  prevPage
}: {
  player: PlayerDB;
    prevPage: string;
}) {
    const now = new Date();
    const dayOfTheWeek = now.toLocaleString('en-us', { weekday: 'long' });
    const rsvpPropName = `${dayOfTheWeek.toLowerCase()}_rsvp`;
    // @ts-ignore
    const isRsvpForToday =  (player[rsvpPropName] as boolean);
    const icon =  isRsvpForToday ? '✅' :'☑️';
    return (
      <div onClick={() => rsvpPlayerForDay(player.phone_number, rsvpPropName, !isRsvpForToday, prevPage)}>
          { icon }
      </div>
  );
}
