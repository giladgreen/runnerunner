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
        style={{ marginTop: 50, textAlign: 'center', zoom: 1.5 }}
      >
        <div style={{ marginTop: 10 }}>
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
            style={{ margin: '2px 10px', zoom: 1.7, color: 'var(--grey-light)' }}
          >
            {player.phone_number}
          </div>
          { showCreditData && <div>
            <span style={{ fontSize: 40 }}>קרדיט:</span>
            <b style={{ marginRight: 5 }}>
              {player.balance < 0 ? 'חוב של' : ''}
            </b>
            <span
              className="truncate font-semibold"
              style={{
                zoom: 2.2,
                color: formatCurrencyColor(player.balance),
              }}
            >
              <b> {formatCurrency(Math.abs(player.balance))}</b>
            </span>
          </div>}
        </div>
      </div>
      {showCreditData && <PlayerPagePlayerCreditHistory player={player} />}
    </div>
  );
}
