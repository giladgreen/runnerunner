'use client';
import React from 'react';
import AreYouSure from '@/app/ui/client/AreYouSure';
import { resetTournamentPositions } from '@/app/lib/actions';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ResetPlayersPositionsButton({
  tournamentId,
  tournamentName,
  date,
}: {
  tournamentId: string;
  tournamentName: string;
  date: string;
}) {
  const [show, setShow] = React.useState(false);
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;
  return (
    <div
      className="give-credit-modal-button"
      style={{ marginRight: 0, marginTop: 10 }}
    >
      <div
        onClick={() => {
          setShow(true);
        }}
        className="pointer link-color reset-credit-button"
        style={{
          justifyContent: 'center',
          marginLeft: 0,
          marginBottom: 20,
        }}
      >
        <u> איפוס דירוג </u>
      </div>

      <div className={show ? 'edit-player-modal' : 'hidden'}>
        <AreYouSure
          onConfirm={() => {
            setShow(false);
            resetTournamentPositions(tournamentId, date, prevPage);
          }}
          onCancel={() => setShow(false)}
          action={`${tournamentName}   איפוס מיקומי שחקנים `}
          question="האם אתה בטוח?"
        />
      </div>
    </div>
  );
}
