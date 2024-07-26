'use client';

import { HashtagIcon } from '@heroicons/react/24/outline';
import Button from '@/app/ui/client/Button';
import { setPlayerPosition } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { PlayerForm } from '@/app/lib/definitions';
import SpinnerButton from '@/app/ui/client/SpinnerButton';
import {useEffect, useState} from "react";

export default function SetPositionForm({
  player,
  hide,
  prevPage,
  initPosition
}: {
  player: PlayerForm;
  hide?: () => void;
  prevPage: string;
  initPosition: number;
}) {
  const setPlayerPositionWithPlayerId = setPlayerPosition.bind(null, {
    playerId: player.id,
    prevPage,
  });

  const [position, setPosition] = useState(initPosition);
  useEffect(() => {
    setPosition(initPosition);
  }, [initPosition]);
  return (
    <div className="edit-player-modal-inner-div">
      <form action={setPlayerPositionWithPlayerId} className="form-control">
        <label className="mb-2 block text-sm font-medium">
          הגדר מיקום שחקן
        </label>
        <div className="form-inner-control  rounded-md p-4 md:p-6">
          {/*  balance change */}
          <div className="mb-4">
            <label
              htmlFor="position"
              className="mb-2 block text-sm font-medium"
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
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="position-error"
                />
                <HashtagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <SpinnerButton text="עדכן" onClick={() => hide?.()} />
        </div>
      </form>
      {hide && (
        <Button onClick={hide} style={{ marginTop: -52, marginLeft: 20 }}>
          ביטול
        </Button>
      )}
    </div>
  );
}
