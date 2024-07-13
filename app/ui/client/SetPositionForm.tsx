'use client';

import { HashtagIcon } from '@heroicons/react/24/outline';
import Button from '@/app/ui/client/Button';
import { setPlayerPosition } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { PlayerForm } from '@/app/lib/definitions';

export default function SetPositionForm({
  player,
  hide,
  prevPage,
}: {
  player: PlayerForm;
  hide?: () => void;
  prevPage: string;
}) {
  const initialState = { message: null, errors: {} };
  const setPlayerPositionWithPlayerId = setPlayerPosition.bind(null, {
    playerId: player.id,
    prevPage,
  });
  // @ts-ignore
  const [state1, dispatch] = useFormState(
      // @ts-ignore
    setPlayerPositionWithPlayerId,
    initialState,
  );

  return (
    <div className="edit-player-modal-inner-div">
      <form action={dispatch} className="form-control">
        <label className="mb-2 block text-sm font-medium">
          Set Player Place
        </label>
        <div className="form-inner-control  rounded-md p-4 md:p-6">
          {/*  balance change */}
          <div className="mb-4">
            <label
              htmlFor="position"
              className="mb-2 block text-sm font-medium"
            >
              Place
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
                  placeholder="Enter position"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="position-error"
                />
                <HashtagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <div id="change-error" aria-live="polite" aria-atomic="true">
                {state1?.errors?.position &&
                  state1?.errors.position.map((error: string) => (
                    <div className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Button type="submit" onClick={() => hide?.()}>
            Set
          </Button>
        </div>
      </form>
      {hide && (
        <Button onClick={hide} style={{ marginTop: -52, marginLeft: 20 }}>
          Cancel
        </Button>
      )}
    </div>
  );
}
