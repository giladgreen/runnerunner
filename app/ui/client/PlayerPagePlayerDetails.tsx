'use client';

import { formatCurrency, formatCurrencyColor } from '@/app/lib/utils';
import React from 'react';
import { PlayerDB } from '@/app/lib/definitions';
import * as FlowbiteReact from 'flowbite-react';
import { getInitials } from '@/app/ui/client/Avatar';
import PlayerPagePlayerCreditHistory from '@/app/ui/client/PlayerPagePlayerCreditHistory';

export default function PlayerPagePlayerDetails({
  player,
  showCreditData
}: {
  player: PlayerDB;
  showCreditData: boolean
}) {
  const isDefaultImage =
    !player.image_url || player.image_url.includes('default.png');

  return (
    <div>
      <div
        className="rtl user-data-page"
        style={{ marginTop: 0, textAlign: 'center' }}
      >
        <div style={{ marginTop: 0 }}>
          <FlowbiteReact.Avatar
            img={isDefaultImage ? undefined : player.image_url}
            placeholderInitials={
              isDefaultImage ? getInitials(player.name) : undefined
            }
            bordered
            color={
              player.balance < 0
                ? 'failure'
                : player.balance > 0
                  ? 'success'
                  : 'gray'
            }
            size="xl"
          />

          <div
            className="truncate font-semibold"
            style={{ margin: '2px 10px', zoom: 2 }}
          >
            {player.name}
          </div>
          <div
            className="truncate font-semibold"
            style={{
              margin: '2px 10px',
              zoom: 1.7,
              color: 'var(--grey-light)',
            }}
          >
            {player.phone_number}
          </div>
          {showCreditData && (
            <div>
              <div style={{ fontSize: 30 }}>קרדיט:</div>
              <div style={{ fontSize: 22 }}>
                <b>{player.balance < 0 ? 'חוב של' : ''}</b>
              </div>

              <span
                className="truncate font-semibold"
                style={{
                  fontSize: 33,
                  // zoom: 2.2,
                  color: formatCurrencyColor(player.balance),
                }}
              >
                <b> {formatCurrency(Math.abs(player.balance))}</b>
              </span>
            </div>
          )}
        </div>
      </div>
      {showCreditData && <PlayerPagePlayerCreditHistory player={player} />}
    </div>
  );
}
