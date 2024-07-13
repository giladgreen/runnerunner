'use client';

import Button from '@/app/ui/client/Button';
import { setPlayerPrize } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { PlayerForm } from '@/app/lib/definitions';

export default function SetPrizeForm({
  player,
  hide,
  prevPage,
}: {
  player: PlayerForm;
  hide?: () => void;
  prevPage: string;
}) {
  const initialState = { message: null, errors: {} };
  const setPlayerPrizeWithPlayerId = setPlayerPrize.bind(null, {
    playerId: player.id,
    prevPage,
  });
  // @ts-ignore
  const [state1, dispatch] = useFormState(
    setPlayerPrizeWithPlayerId,
    initialState,
  );

  return (
    <div className="edit-player-modal-inner-div">
      <form action={dispatch} className="form-control">
        <label className="mb-2 block text-sm font-medium">
          Set Player Prize
        </label>
        <div className="form-inner-control  rounded-md p-4 md:p-6">
          {/*  prize name */}
          <div className="mb-4">
            <label htmlFor="prize" className="mb-2 block text-sm font-medium">
              Prize
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="prize"
                  name="prize"
                  type="text"
                  // aria-valuemin={0}
                  placeholder="Enter prize"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="prize-error"
                />
              </div>
              <div id="prize-error" aria-live="polite" aria-atomic="true">
                {state1?.errors?.prize &&
                  state1?.errors.prize.map((error: string) => (
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
