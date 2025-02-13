'use client';

import { PlayerDB, PrizeInfoDB } from '@/app/lib/definitions';
import React from 'react';

import { usePathname, useSearchParams } from 'next/navigation';
import SetPrizeForm from '@/app/ui/client/SetPrizeForm';
import { GiftIcon } from '@heroicons/react/24/solid';
import { Tooltip } from 'flowbite-react';

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
  const button = <button
    className="pointer rounded-md border p-2 "
    onClick={() => {
      setShow(true);
    }}
  >
    <Tooltip content="פרס" color="primary">
      <GiftIcon className="w-6" />
    </Tooltip>
  </button>
  if (show) {
    return (
      <div>
        {button}
        <div className="SetPrizeFormWrapper">
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
  return (
    <div>
      {button}
    </div>
  );
}
