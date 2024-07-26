'use client';

import { setPlayerPosition } from '@/app/lib/actions';
import {PlayerDB } from '@/app/lib/definitions';
import React from "react";
import Spinner from "@/app/ui/client/Spinner";

export default function DeletePositionButton({
  player,
  prevPage,
}: {
  player: PlayerDB;
  prevPage: string;
}) {
    const [pending, setPending] = React.useState(false);

    if (pending) {
        return <Spinner size={36} />;
    }
    // @ts-ignore
  const setPlayerPositionWithPlayerId = setPlayerPosition.bind(null, {
    playerId: player.id,
    prevPage,
  });
  // @ts-ignore

   const playerPosition = player.position && Number(player.position) > 0 ? player.position : 0;

   if (playerPosition === 0) {
       return null;
   }

    return (
      <form action={setPlayerPositionWithPlayerId} className="form-control" style={{ border: 'none'}}>
        <input
          id="position"
          name="position"
          type="number"
          step="1"
          value={0}
          onChange={() => {}}
          style={{ visibility: 'hidden', display: 'none' }}
        />
        <button
            type="submit"
            onClick={() => {
                setPending(true);
                setTimeout(() => {
                    setPending(false);
                },1200)
            }}
            style={{
              background: '#6666CCCC',
              color: 'white',
              width: 30,
              height: 30,
              borderRadius: 50,
              textAlign: 'center',
              cursor: 'pointer',
            }}
        >
          #{player.position}
        </button>
      </form>
  );
}
