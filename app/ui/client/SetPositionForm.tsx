'use client';

import { HashtagIcon } from '@heroicons/react/24/outline';
import { setPlayerPosition } from '@/app/lib/actions';
import { useEffect, useMemo, useState } from 'react';
import { PlayerDB } from '@/app/lib/definitions';
import { ConfettiButton } from '@/app/ui/components/ui/confetti';

export default function SetPositionForm({
  player,
  hide,
  prevPage,
  initPosition,
  tournamentId,
}: {
  player: PlayerDB;
  hide?: () => void;
  prevPage: string;
  initPosition: number;
  tournamentId: string;
}) {
  const setPlayerPositionWithPlayerId = setPlayerPosition.bind(null, {
    playerId: player.id,
    prevPage,
    tournamentId,
  });

  const [position, setPosition] = useState(initPosition);
  useEffect(() => {
    setPosition(initPosition);
  }, [initPosition]);

  const particleCount= useMemo(()=> {
    if (position === 0) return 0;

    if (position > 10) return 30;

    if (position > 3) {
      return 20 * (11 - position);
    }

    if (position === 3) {
      return 200;
    }

    if (position === 2) {
      return 250;
    }

    return 1000;

  },[position])


  return (
    <div className="SetPositionForm">
      <form action={setPlayerPositionWithPlayerId} className="form-control">
        <label className="mb-2 block  font-medium">
          הגדר מיקום שחקן
        </label>
        <div className="form-inner-control  rounded-md p-4 md:p-6">
          {/*  balance change */}
          <div className="mb-4">
            <label
              htmlFor="position"
              className="mb-2 block  font-medium"
            >
              מיקום
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="position"
                  name="position"
                  type="number"
                  step="1"
                  min={0}
                  // aria-valuemin={0}
                  placeholder="קבע מיקום"
                  value={position}
                  onChange={(e) => setPosition(+e.target.value)}
                  className="peer block w-full rounded-md border  py-2 pl-10  outline-2 "
                  aria-describedby="position-error"
                />
                <HashtagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
              </div>
              * הכנס לאפס בשביל אפס את השחקן
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <ConfettiButton  style={{ marginTop: -52, marginRight: 20 }} onClick={() => {
            if (hide){
              setTimeout(hide, 100);
            }
          }} particleCount={particleCount}>עדכן</ConfettiButton>
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
