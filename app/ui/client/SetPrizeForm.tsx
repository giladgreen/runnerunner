'use client';

import { setPlayerPrize } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { PlayerDB, PrizeInfoDB } from '@/app/lib/definitions';
import SearchablePrizesDropdown from '@/app/ui/client/SearchablePrizesDropdown';
import React, { useState } from 'react';
import SpinnerButton from '@/app/ui/client/SpinnerButton';

export default function SetPrizeForm({
  player,
  hide,
  prevPage,
  prizesInformation,
  tournamentId,
}: {
  player: PlayerDB;
  hide?: () => void;
  prevPage: string;
  prizesInformation: PrizeInfoDB[];
  tournamentId: string;
}) {
  const [selectedPrize, setSelectedPrize] = useState<PrizeInfoDB | undefined>(
    undefined,
  );
  const initialState = { message: null, errors: {} };
  const setPlayerPrizeWithPlayerId = setPlayerPrize.bind(null, {
    playerId: player.id,
    tournamentId,
    prevPage,
  });
  // @ts-ignore
  const [state1, dispatch] = useFormState(
    // @ts-ignore
    setPlayerPrizeWithPlayerId,
    initialState,
  );

  return (
    <div className="SetPrizeForm">
      <form action={dispatch} className="form-control">
        <label className="mb-2 block  font-medium">פרס לשחקן</label>
        <div className="form-inner-control  rounded-md p-4 md:p-6">
          {/*  prize name */}
          <div className="mb-4">
            <label htmlFor="prize" className="mb-2 block  font-medium">
              פרס
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <SearchablePrizesDropdown
                  showPrizeName
                  prizes={prizesInformation}
                  selectedVal={selectedPrize}
                  handleChange={(val: any) => setSelectedPrize(val)}
                />
              </div>
              <div id="prize-error" aria-live="polite" aria-atomic="true">
                {state1?.errors?.prize &&
                  state1?.errors.prize.map((error: string) => (
                    <div className="mt-2  text-red-500" key={error}>
                      {error}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <SpinnerButton text="עדכן" onClick={() =>{
            if (hide){
              setTimeout(hide, 100);
            }
          }} />
        </div>
      </form>
      {hide && (
        <button className="my-button-cancel flex h-10 items-center rounded-lg  px-4 pointer font-medium" onClick={hide} style={{ marginTop: -52, marginRight: 20 }}>
          ביטול
        </button>
      )}
    </div>
  );
}
