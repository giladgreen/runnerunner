'use client';

import React from 'react';
import { PlayerDB } from '@/app/lib/definitions';
import TournamentsHistoryTable from '@/app/ui/client/TournamentsHistoryTable';
import PlayerHistoryTable from '@/app/ui/client/PlayerHistoryTable';

export default function PlayerPagePlayerCreditHistory({
  player,
}: {
  player: PlayerDB;
}) {
  return (
      <div className="rtl" style={{marginTop: 50}}>
          <hr/>
          <TournamentsHistoryTable player={player}/>
          <hr/>
          <div style={{zoom: 2}}>
              <u>
                  <b>הסטוריית קרדיט</b>
              </u>
          </div>
          <div style={{marginTop: 10}}>
              <PlayerHistoryTable player={player}/>
          </div>
      </div>
  );
}
