'use client';
import { Tooltip, Button } from 'flowbite-react';
import { HiOutlineDotsVertical } from 'react-icons/hi';

import { PlayerDB, TournamentDB } from '@/app/lib/definitions';
import UseCreditForm from '@/app/ui/client/UseCreditForm';
import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

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
      <Tooltip content="הכנס שחקן" color="primary">
        <Button
          onClick={() => {
            setShow(true);
          }}
          color="light"
          style={{
            width: 24,
            borderBottomLeftRadius: 0,
            borderTopLeftRadius: 0,
            borderLeft: 0,
          }}
        >
          <HiOutlineDotsVertical className=" h-5 w-5" />
        </Button>
      </Tooltip>
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
