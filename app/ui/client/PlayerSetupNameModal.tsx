'use client';
import { PencilIcon } from '@heroicons/react/24/outline';
import Button from '@/app/ui/client/Button';
import { PlayerDB } from '@/app/lib/definitions';
import { updateNewPlayerName } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

export async function PlayerSetupNameModal({ player }: { player: PlayerDB }) {
  const initialState = { message: null, errors: {} };

  const updateNewPlayerNameWithPlayerId = updateNewPlayerName.bind(
    null,
    player.id,
  );
  // @ts-ignore
  const [state, dispatch] = useFormState(
    updateNewPlayerNameWithPlayerId,
    initialState,
  );

  return (
    <div className="setup-player--name-modal-inner-div">
      <form action={dispatch}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* player Name */}
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              שם מלא
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="name-error"
              />
              <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="player-error" aria-live="polite" aria-atomic="true">
              {
                // @ts-ignore
                state?.errors?.name &&
                  // @ts-ignore
                  state?.errors.name.map((error: string) => (
                    <div className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </div>
                  ))
              }
            </div>
          </div>
        </div>

        <Button type="submit">עדכן</Button>
      </form>
    </div>
  );
}
