'use client';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
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

  const isRSVP = tournamentIds && isRsvpForDate;
  const hasUser = player.hasUser;

  const RSVPBadge = styled(Badge)(() => ({
    '& .MuiBadge-badge':{
      backgroundColor: isRSVP ? '#0072F5' : '#999999',
      color: isRSVP ? '#0072F5' : '#999999',
      width: 10,
      height: 10,
      marginTop: -3,
      marginRight: -3,
      borderRadius: '50%',
      boxShadow: `0 0 0 2px white`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: '1px solid currentColor',
        content: '""',
      },
    }
  }));


  return (
    <div
      className={`avatar-image ${isDefaultImage ? '' : 'zoom-on-hover-bigger'}`}
    >
      <RSVPBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        variant="dot"
        className="zoom-on-hover"
      >
          <FlowbiteReact.Avatar
            img={isDefaultImage ? undefined : player.image_url}
            placeholderInitials={
              isDefaultImage ? getInitials(player.name) : undefined
            }
            rounded
            bordered
            color={
              player.balance < 0
                ? 'failure'
                : player.balance > 0
                  ? 'success'
                  : 'gray'
            }
            size="md"
            style={style}
            statusPosition={'bottom-right'}
            status={hasUser ? 'online' : 'offline'}
          />

      </RSVPBadge>
    </div>
  );
}
