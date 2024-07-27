'use client';

import Button from '@/app/ui/client/Button';
import React from 'react';
import { PlayerDB, PrizeDB, TournamentDB } from '@/app/lib/definitions';

export default function ExportPlayersWithMarketingInfoButton({
  players,
}: {
  players: PlayerDB[];
}) {
  const allowed_marketing_players = players.filter(
    (player) => player.allowed_marketing,
  );
  return (
    <>
      <Button
        style={{ textAlign: 'center', width: '100%' }}
        onClick={() => {
          const todayDate = new Date().toISOString().slice(0, 10);
          const data = `name, phone number,
${allowed_marketing_players.map((player) => {
  return `${player.name},${player.phone_number}`;
}).join(`
`)}`;
          const filename = `${allowed_marketing_players.length}_allowed_marketing_players_${todayDate}.csv`;
          const blob = new Blob([data], {
            type: 'text/plain;charset=utf-8',
          });

          const link = document.createElement('a');
          link.download = filename;
          link.href = window.URL.createObjectURL(blob);
          link.style.display = 'none';

          document.body.appendChild(link);

          link.click();

          document.body.removeChild(link);
        }}
      >
        <div style={{ textAlign: 'center', width: '100%' }}>לחץ כאן</div>
      </Button>
      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        accept=".csv"
      />
    </>
  );
}
