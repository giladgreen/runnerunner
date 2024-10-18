'use client';
import { Tooltip, Button } from 'flowbite-react';
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
      <Tooltip content="שחקן שילם" color="primary">
        <Button
          onClick={() => {
            setShow(true);
          }}
          color="light"
        >
          <span style={{ fontSize: 22 }}>₪</span>
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
