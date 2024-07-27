'use client';

import Button from '@/app/ui/client/Button';
import React from 'react';
import { PlayerDB, PrizeDB, TournamentDB } from '@/app/lib/definitions';

let lastSave = 0;
function saveOtherDataToFile(
  playersPlaces: PlayerDB[],
  prizes: PrizeDB[],
  tournament: TournamentDB,
  worker?: boolean,
) {
  if (worker) {
    return;
  }

  const addPlaces = playersPlaces && playersPlaces.length > 0;
  const addPrizes = prizes && prizes.length > 0;
  const filename = `players_${
    addPlaces && addPrizes
      ? 'places_and_prizes'
      : addPlaces
      ? 'places'
      : 'prizes'
  }.csv`;

  const placesData = addPlaces
    ? `position, phone number, name 
${playersPlaces
  .map((player) => {
    return `${player.position}, ${player.phone_number},${player.name}`;
  })
  .join('\n')}`
    : '';

  const prizesData = addPrizes
    ? `Name, phone number, prize, tournament
${prizes
  .map(
    (prize) =>
      `${prize!.player!.name}, ${prize!.phone_number}, ${prize.prize},  ${
        prize.tournament
      }`,
  )
  .join('\n')}`
    : '';

  const fileData = `${tournament.name}

${placesData}

${prizesData}


`;

  const dataBlob = new Blob([fileData], {
    type: 'text/plain;charset=utf-8',
  });

  const dataLink = document.createElement('a');
  dataLink.download = filename;
  dataLink.href = window.URL.createObjectURL(dataBlob);
  dataLink.style.display = 'none';

  document.body.appendChild(dataLink);

  dataLink.click();

  document.body.removeChild(dataLink);
}
export function savePlayersDataToFile(players: PlayerDB[]) {
  const now = new Date();
  if (now.getTime() - lastSave < 5000) {
    return;
  }
  lastSave = now.getTime();
  const todayDate = now.toISOString().slice(0, 10);

  const creditData = `phone number, name, balance, notes
${players
  .sort((a, b) => (a.balance < b.balance ? 1 : -1))
  .map((player) => {
    return `${player.phone_number},${player.name},${player.balance},${player.notes}`;
  }).join(`
`)}`;
  const creditFilename = `players_credit_${todayDate}.csv`;
  const creditBlob = new Blob([creditData], {
    type: 'text/plain;charset=utf-8',
  });

  const creditLink = document.createElement('a');
  creditLink.download = creditFilename;
  creditLink.href = window.URL.createObjectURL(creditBlob);
  creditLink.style.display = 'none';

  document.body.appendChild(creditLink);

  creditLink.click();

  document.body.removeChild(creditLink);
}

export default function ExportPlayersButton({
  players,
  playersPlaces,
  worker,
  tournament,
  prizes,
}: {
  players: PlayerDB[];
  playersPlaces: PlayerDB[];
  tournament: TournamentDB;
  prizes: PrizeDB[];
  worker?: boolean;
}) {
  return (
    <>
      <Button
        style={{ width: '100%', textAlign: 'center' }}
        onClick={() => {
          savePlayersDataToFile(players);
          saveOtherDataToFile(playersPlaces, prizes, tournament, worker);
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
