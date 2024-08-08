'use client';

import { PlayerDB } from '@/app/lib/definitions';
import SetPositionForm from '@/app/ui/client/SetPositionForm';
import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { HashtagIcon } from '@heroicons/react/24/solid';

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
  const enableButton =   player.arrived === tournamentId;
  const tooltip = enableButton ? 'קבע דירוג' :'';
  const close = () => {
    setShow(false);
  };
  return (
    <div>
      <button
        className="pointer rounded-md border p-2 hover:bg-gray-100"
        onClick={() => {
            if (enableButton) {
                setShow(true);
            }

        }}
      >
        <span className="sr-only">Position</span>
        <HashtagIcon className="w-6" title={tooltip} style={{ color: enableButton ? 'black':'gray',  cursor: enableButton ? 'pointer':'no-drop'  }} />
      </button>
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
