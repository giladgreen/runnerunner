'use client';

import { PlayerDB, PrizeInfoDB } from '@/app/lib/definitions';
import React from 'react';

import { usePathname, useSearchParams } from 'next/navigation';
import SetPrizeForm from '@/app/ui/client/SetPrizeForm';
import { GiftIcon, HashtagIcon } from '@heroicons/react/24/solid';

export default function OpenPrizeModalButton({
  player,
  prizesInformation,
  tournamentId,
}: {
  player: PlayerDB;
  prizesInformation: PrizeInfoDB[];
  tournamentId: string;
}) {
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;
  const [show, setShow] = React.useState(false);

  const close = () => {
    setShow(false);
  };
  return (
    <div>
      <button
        className="pointer rounded-md border p-2 hover:bg-gray-100"
        onClick={() => {
          setShow(true);
        }}
      >
        <span className="sr-only">Prize</span>
        <GiftIcon className="w-6" title="Prize" />
      </button>

      <div className={show ? 'edit-player-modal' : 'hidden'}>
        <SetPrizeForm
          player={player}
          hide={close}
          prevPage={prevPage}
          prizesInformation={prizesInformation}
          tournamentId={tournamentId}
        />
      </div>
    </div>
  );
}
