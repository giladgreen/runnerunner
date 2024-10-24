'use client';

import { PlayerDB } from '@/app/lib/definitions';
import * as FlowbiteReact from 'flowbite-react';
import React from 'react';
import { getTodayDate } from '@/app/lib/clientDateUtils';

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);
};

export default function Avatar({
  player,
  tournamentIds,
  style,
}: {
  player: PlayerDB;
  tournamentIds?: string[];
  style?: React.CSSProperties;
}) {
  const isDefaultImage =
    !player.image_url || player.image_url.includes('default.png');
  const date = getTodayDate();
  const isRsvpForDate =
    tournamentIds &&
    Boolean(
      player.rsvps.find(
        (r) => r.date === date && tournamentIds.includes(r.tournamentId),
      ),
    );
  const status = tournamentIds
    ? isRsvpForDate
      ? 'online'
      : 'offline'
    : undefined;
  return (
    <div className="avatar-image zoom-on-hover-bigger">
      <FlowbiteReact.Avatar
        img={isDefaultImage ? undefined : player.image_url}
        placeholderInitials={
          isDefaultImage ? getInitials(player.name) : undefined
        }
        rounded
        bordered
        status={status}
        color={
          player.balance < 0
            ? 'failure'
            : player.balance > 0
              ? 'success'
              : 'gray'
        }
        statusPosition="top-right"
        size="md"
        className="zoom-on-hover"
        style={style}
      />
    </div>
  );
}
