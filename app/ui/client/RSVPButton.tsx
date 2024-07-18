'use client';

// @ts-ignore
import { useOptimistic } from "react";

import { PlayerDB } from '@/app/lib/definitions';
import { rsvpPlayerForDay } from '@/app/lib/actions';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/dist/client/components/navigation';
export default function RSVPButton({
  player,
  stringDate,
  text,
  updateOptimisticPlayers
}: {
  player: PlayerDB;
  stringDate?: string;
  text?: string;
  updateOptimisticPlayers: any
}) {
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;
  const date = stringDate ?? new Date().toISOString().slice(0, 10);
  const isRsvpForDate = player.rsvps.includes(date);

  const [optimisticIsRsvpForDate, addOptimisticIsRsvpForDate] = useOptimistic<boolean>(isRsvpForDate, (state: boolean) => !state);

  const icon = optimisticIsRsvpForDate ? '🟢' : '⚫️';
  return (
    <div
      onClick={() => {
        const newPlayer = {
          ...player,
          rsvpForToday: !isRsvpForDate
        }
          addOptimisticIsRsvpForDate(!isRsvpForDate)
         updateOptimisticPlayers(newPlayer);
         rsvpPlayerForDay(player.phone_number, date, !isRsvpForDate, prevPage)
      }}
    >
      <span className="pointer">{icon}</span> {text}
    </div>
  );
}
