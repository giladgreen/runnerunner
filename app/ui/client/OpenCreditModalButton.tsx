'use client';

import { PlayerDB, TournamentDB } from '@/app/lib/definitions';
import UseCreditForm from '@/app/ui/client/UseCreditForm';
import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { PlusCircleIcon } from '@heroicons/react/24/solid';

export default function OpenCreditModalButton({
  player,
  userId,
  tournaments,
  players,
  setQuery,
}: {
  player: PlayerDB;
  tournaments: TournamentDB[];
  players: PlayerDB[];
  userId: string;
  setQuery: (val: string) => void;
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
        <span className="sr-only">Pay</span>
        <PlusCircleIcon className="w-6" title="הכנס" />
      </button>
      <div className={show ? 'edit-player-modal' : 'hidden'}>
        <UseCreditForm
          players={players}
          player={player}
          tournaments={tournaments}
          hide={close}
          prevPage={prevPage}
          userId={userId}
          setQuery={setQuery}
        />
      </div>
    </div>
  );
}
