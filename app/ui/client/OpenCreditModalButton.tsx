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
  tournamentId,
}: {
  player: PlayerDB;
  tournaments: TournamentDB[];
  players: PlayerDB[];
  tournamentId: string | null;
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
        <div
          title="הכנס"
          style={{
            border: '1px solid black',
            color: 'white',
            textAlign: 'center',
            borderRadius: 12,
            width: 20,
            height: 20,
            background: 'black',
          }}
        >
          <b>
            <div style={{ marginTop: -2 }}>₪</div>{' '}
          </b>
        </div>
        {/*<PlusCircleIcon className="w-6" title="הכנס" />*/}
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
          tournamentId={tournamentId}
        />
      </div>
    </div>
  );
}
