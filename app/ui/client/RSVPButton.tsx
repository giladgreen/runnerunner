'use client';

// @ts-ignore
import { startTransition, useOptimistic } from 'react';

import { PlayerDB } from '@/app/lib/definitions';
import { rsvpPlayerForDay } from '@/app/lib/actions';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/dist/client/components/navigation';
export default function RSVPButton({
  player,
  stringDate,
  text,
}: {
  player: PlayerDB;
  stringDate?: string;
  text?: string;
}) {
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;
  const date = stringDate ?? new Date().toISOString().slice(0, 10);
  const isRsvpForDate = player.rsvps.includes(date);

  const [optimisticIsRsvpForDate, addOptimisticIsRsvpForDate] =
    useOptimistic<boolean>(isRsvpForDate, (state: boolean) => !state);

  const icon = optimisticIsRsvpForDate ? '🟢' : '⚫️';
  return (
    <div
      onClick={() => {
        startTransition(() => {
          addOptimisticIsRsvpForDate(!isRsvpForDate);
        });

        rsvpPlayerForDay(player.phone_number, date, !isRsvpForDate, prevPage);

      }}
    >
      <span className="pointer">{icon}</span> {text}
    </div>
  );
}
