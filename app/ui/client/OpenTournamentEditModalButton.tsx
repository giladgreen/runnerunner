'use client';

import { PlayerDB, PrizeInfoDB, TournamentDB } from '@/app/lib/definitions';
import React from 'react';

import { usePathname, useSearchParams } from 'next/navigation';
import SetPrizeForm from '@/app/ui/client/SetPrizeForm';
import { GiftIcon } from '@heroicons/react/24/solid';
import { Tooltip } from 'flowbite-react';
import { PencilIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import EditTournamentForm from '@/app/ui/client/EditTournamentForm';

export default function OpenTournamentEditModalButton({
                                                        tournament,userId
}: {
  userId: string;
  tournament: TournamentDB;
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
    <Tooltip content="ערוך טורניר" color="primary">

        <PencilIcon className="w-5" />

    </Tooltip>
  </button>
  if (show) {
    return (
      <div>
        {button}
        <div className="EditTournamentFormWrapper">
          <EditTournamentForm
            hide={close}
            userId={userId}
            prevPage={prevPage}
            tournament={tournament}
          />
        </div>
      </div>
    );
  }
  return button;
}
