'use client';

import { PlayerDB, TournamentDB } from '@/app/lib/definitions';
import UseCreditForm from '@/app/ui/client/UseCreditForm';
import React from 'react';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';

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
      <div
        onClick={() => {
          setShow(true);
        }}
        className="pointer"
        style={{ fontSize: '24' }}
      >
        <Image
          title={'pay'}
          src={`/pay.png`}
          alt={`pay`}
          className="zoom-on-hover mr-4"
          width={35}
          height={35}
        />
      </div>
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
