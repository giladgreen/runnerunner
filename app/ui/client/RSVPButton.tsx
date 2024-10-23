'use client';

// @ts-ignore
import { startTransition, useOptimistic } from 'react';

import { PlayerDB } from '@/app/lib/definitions';
import { rsvpPlayerForDay } from '@/app/lib/actions';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/dist/client/components/navigation';
import { getTodayDate } from '@/app/lib/clientDateUtils';
import { Switch } from '@nextui-org/react';

export default function RSVPButton({
  player,
  stringDate,
  tournamentId,
  text,
}: {
  player: PlayerDB;
  text?: string;
  stringDate?: string;
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

  const onClick = () => {
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
  };
  return (
    <div style={{ display: 'flex', margin: '5px 0' }} onClick={onClick}>
      <Switch
        initialChecked={optimisticIsRsvpForDate}
        color="success"
        onClick={onClick}
      />
      {text}
    </div>
  );
}
