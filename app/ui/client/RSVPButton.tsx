'use client';

// @ts-ignore
import { startTransition, useOptimistic } from 'react';

import { PlayerDB } from '@/app/lib/definitions';
import { rsvpPlayerForDay } from '@/app/lib/actions';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/dist/client/components/navigation';
import { getTodayDate } from '@/app/lib/clientDateUtils';
export default function RSVPButton({
  player,
  stringDate,
  text,
  tournamentId,
}: {
  player: PlayerDB;
  stringDate?: string;
  text?: string;
  tournamentId: string;
}) {
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;
  const date = stringDate ?? getTodayDate();
  const isRsvpForDate = Boolean(
    player.rsvps.find(
      (r) => r.date === date && r.tournamentId === tournamentId,
    ),
  );

  const [optimisticIsRsvpForDate, addOptimisticIsRsvpForDate] =
    useOptimistic<boolean>(isRsvpForDate, (state: boolean) => !state);

  return (
    <div
      style={{ display: 'flex', margin: '5px 0' }}
      onClick={() => {
        startTransition(() => {
          addOptimisticIsRsvpForDate(!isRsvpForDate);
        });

        rsvpPlayerForDay(
          player.phone_number,
          date,
          tournamentId,
          !isRsvpForDate,
          prevPage,
        );
      }}
    >
      <span className="pointer" style={{ display: 'flex' }}>
        <div
          style={{
            margin: '0 5px',
            width: 30,
            height: 30,
            border: '1px solid black',
            borderRadius: 15,
            background: optimisticIsRsvpForDate ? 'green' : 'white',
          }}
        />
      </span>
      {text}
    </div>
  );
}
