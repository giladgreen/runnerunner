'use client';
import React from 'react';
import { formatCurrency, formatCurrencyColor } from '@/app/lib/utils';
import { PlayerDB } from '@/app/lib/definitions';

export default function PlayerHeaderLinkSection({
  userId,
  playerName,
  player,
  playersSeeCreditEnabled,
}: {
  userId: string;
  playerName?: string;
  player?: PlayerDB | null;
  playersSeeCreditEnabled: boolean;
}) {
  const isOnNoPage = window.location.pathname === '/';
  if (isOnNoPage) {
    location.reload();
  }
  const isInPlayerDataPage = window.location.pathname.includes('player_registration') || window.location.pathname === '/'
  if (isInPlayerDataPage) {
    return (
      <div className="logged-in-player ">
        <div className="logged-in-player-name ">{playerName}</div>
        {playersSeeCreditEnabled && player && (
          <div
            className="logged-in-player-credit "
            style={{
              color: formatCurrencyColor(player.balance),
            }}
          >
            <a href={`/${userId}`}>{formatCurrency(player.balance)}</a>

          </div>
        )}
      </div>
    );
  }

  return <div className="logged-in-player ">
    <a href={'/'}>לעמוד הרשמה</a>
  </div>

}
