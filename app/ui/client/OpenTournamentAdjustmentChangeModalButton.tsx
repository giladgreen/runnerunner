'use client';

import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import TournamentAdjustmentForm from '@/app/ui/client/TournamentAdjustmentForm';

export default function OpenTournamentAdjustmentChangeModalButton({
  tournamentId,
  userId,
}: {
  tournamentId: string;
  userId: string;
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
        <span className="sr-only">הכנס</span>
        <div
          title="הכנס"
          style={{ textAlign: 'center' }}
        >
          <b>
            <div>שינוי ידני של הסכומים</div>
          </b>
        </div>
        {/*<PlusCircleIcon className="w-6" title="הכנס" />*/}
      </button>
      <div className={show ? 'edit-player-modal' : 'hidden'}>
        <TournamentAdjustmentForm
          hide={close}
          prevPage={prevPage}
          userId={userId}
          tournamentId={tournamentId}
        />
      </div>
    </div>
  );
}
