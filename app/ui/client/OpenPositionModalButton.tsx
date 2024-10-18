'use client';

import { PlayerDB } from '@/app/lib/definitions';
import SetPositionForm from '@/app/ui/client/SetPositionForm';
import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button, Tooltip } from 'flowbite-react';

export default function OpenPositionModalButton({
  player,
  initPosition,
  tournamentId,
}: {
  player: PlayerDB;
  initPosition: number;
  tournamentId: string;
}) {
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;
  const [show, setShow] = React.useState(false);
  const enableButton = player.arrived === tournamentId;
  const close = () => {
    setShow(false);
  };
  return (
    <div>
      <Tooltip content="קבע מיקום" color="primary">
        <Button
          onClick={() => {
            if (enableButton) {
              setShow(true);
            }
          }}
          color="light"
          disabled={!enableButton}
        >
          <span style={{ fontSize: 22 }}>#</span>
        </Button>
      </Tooltip>
      <div className={show ? 'edit-player-modal' : 'hidden'}>
        <SetPositionForm
          player={player}
          hide={close}
          prevPage={prevPage}
          initPosition={initPosition}
          tournamentId={tournamentId}
        />
      </div>
    </div>
  );
}
