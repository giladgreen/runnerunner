'use client';

import React from 'react';
import { PlayerDB } from '@/app/lib/definitions';
import { getTodayDate } from '@/app/lib/clientDateUtils';

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
      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        accept=".csv"

      />
      <button
        className=""
        onClick={() => {
          const todayDate = getTodayDate();
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
        <div>ייצוא רשימת שחקנים שאישרו תוכן שיווקי</div>
      </button>

    </>
  );
}
