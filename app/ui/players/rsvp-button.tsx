'use client';

import { PlayerDB} from '@/app/lib/definitions';
import {rsvpPlayerForDay} from "@/app/lib/actions";

export default function RSVPButton({
  player,
  prevPage,
  stringDate,
    text
}: {
  player: PlayerDB;
    prevPage: string;
    stringDate?:string;
    text?:string;
}) {
    const date = stringDate ?? (new Date()).toISOString().slice(0,10);
    const isRsvpForDate = player.rsvps.includes(date);
    const icon =  isRsvpForDate ? '✅' :'☑️';
    return (
      <div onClick={() => rsvpPlayerForDay(player.phone_number, date, !isRsvpForDate, prevPage)}>
        <span className="pointer">{ icon }</span>  {text}
      </div>
  );
}
