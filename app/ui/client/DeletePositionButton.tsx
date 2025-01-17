'use client';

import { setPlayerPosition } from '@/app/lib/actions';
import { PlayerDB } from '@/app/lib/definitions';
import React from 'react';

export default function DeletePositionButton({
  player,
  prevPage,
}: {
  player: PlayerDB;
  prevPage: string;
}) {
  // @ts-ignore
  const setPlayerPositionWithPlayerId = setPlayerPosition.bind(null, {
    playerId: player.id,
    prevPage,
  });

  const playerPosition =
    player.position && Number(player.position) > 0 ? player.position : 0;

  if (playerPosition === 0) {
    return null;
  }

  return (
    <form
      action={setPlayerPositionWithPlayerId}
      className="form-control"
      style={{ border: 'none' }}
    >
      <input
        id="position"
        name="position"
        type="number"
        step="1"
        value={0}
        onChange={() => {}}
        className="hidden"
      />
      <button
        type="submit"
        className="delete-position-button"
      >
        #{player.position}
      </button>
    </form>
  );
}
