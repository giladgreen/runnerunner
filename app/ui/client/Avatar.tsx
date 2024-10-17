import { PlayerDB } from '@/app/lib/definitions';
import * as FlowbiteReact from 'flowbite-react';
import React from 'react';
import { getTodayDate } from '@/app/lib/clientDateUtils';

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('');
};

export default function Avatar({
  player,
  tournamentId,
}: {
  player: PlayerDB;
  tournamentId?: string;
}) {
  const isDefaultImage =
    !player.image_url || (player.image_url ?? '').includes('default.png');
  const date = getTodayDate();
  const isRsvpForDate = Boolean(
    player.rsvps.find(
      (r) => r.date === date && r.tournamentId === tournamentId,
    ),
  );
  const status = tournamentId
    ? isRsvpForDate
      ? 'online'
      : 'offline'
    : undefined;
  return (
    <FlowbiteReact.Avatar
      img={isDefaultImage ? undefined : player.image_url}
      placeholderInitials={
        isDefaultImage ? getInitials(player.name) : undefined
      }
      rounded
      bordered
      status={status}
      color={
        player.balance < 0 ? 'failure' : player.balance > 0 ? 'success' : 'gray'
      }
      statusPosition="top-right"
      size="md"
    />
  );
}
