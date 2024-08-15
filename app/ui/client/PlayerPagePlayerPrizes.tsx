'use client';

import React from 'react';
import { PrizeDB } from '@/app/lib/definitions';
import PlayersPrizesPage from '@/app/[userId]/prizes/PlayersPrizesPage';

export default function PlayerPagePlayerPrizes({
  playerPrizes,
  prizesContents,
}: {
  playerPrizes: {
    chosenPrizes: PrizeDB[];
    deliveredPrizes: PrizeDB[];
    readyToBeDeliveredPrizes: PrizeDB[];
  };
  prizesContents: {
    chosenPrizesContent: JSX.Element;
    deliveredPrizesContent: JSX.Element;
    readyToBeDeliveredPrizesContent: JSX.Element;
  };
}) {
  return (
    <div className="rtl" style={{ marginTop: 50 }}>
      <div style={{ zoom: 2 }}>
        <u>
          <b>פרסים</b>
        </u>
      </div>
      <div style={{ marginTop: 30 }}>
        <PlayersPrizesPage
          playerPrizes={playerPrizes}
          prizesContents={prizesContents}
          playerPage
        />
      </div>
    </div>
  );
}
