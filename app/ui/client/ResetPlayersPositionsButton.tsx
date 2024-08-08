'use client';
import React from 'react';
import AreYouSure from "@/app/ui/client/AreYouSure";
import { resetTournamentPositions} from "@/app/lib/actions";
import {usePathname, useSearchParams} from "next/navigation";

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
        className="pointer"
        style={{ justifyContent: 'center', color: 'blue', marginLeft: 0, marginBottom:20 }}
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
            subtext={tournamentName}
            text="האם לאפס את מיקומי השחקנים עבור טורניר זה?"
        />
      </div>
    </div>
  );
}
