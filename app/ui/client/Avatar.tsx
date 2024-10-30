'use client';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import { PlayerDB } from '@/app/lib/definitions';
import * as FlowbiteReact from 'flowbite-react';
import React, {useMemo} from 'react';
import { getTodayDate } from '@/app/lib/clientDateUtils';

const getProps = (color: string)=> ({
  backgroundColor: color,
  color,
  marginTop: -2,
  marginRight: -2,
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
})

// @ts-ignore
const HasUserBadge = styled(Badge)(({ theme, hasUser }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: hasUser ? '#00AA00' : '#999999',
    color: hasUser ? '#00AA00' : '#999999',
    marginTop: -2,
    marginRight: -2,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
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
  },
}));


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
console.log('## user:', player.name);
console.log('## isRSVP', isRSVP);
console.log('## hasUser', hasUser);

const RSVPBadge  = styled(Badge)(() => ({
    '& .MuiBadge-badge': {
      ...getProps(isRSVP ? '#0072F5' : '#999999')
    },
  }));

const UserBadge  = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    ...getProps(hasUser ? '#00AA00' : '#999999')
  },
}));
  console.log('## ');
  return (
    <div
      className={`avatar-image ${isDefaultImage ? '' : 'zoom-on-hover-bigger'}`}
    >
      <UserBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          variant="dot"
          className="zoom-on-hover"
      >
          <RSVPBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              variant="dot"
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
              />
          </RSVPBadge>
      </UserBadge>
    </div>
  );
}
