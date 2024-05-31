'use client';
import { updatePlayer } from '@/app/lib/actions';

import { PlayerForm } from '@/app/lib/definitions';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import {useFormState} from "react-dom";
import {PencilIcon} from "@heroicons/react/24/outline";

export default function EditPlayerForm({
  player,
}: {
  player: PlayerForm;
}) {
  const initialState = { message: null, errors: {} };
  console.log(' player.id', player.id)
  const updatePlayerWithId = updatePlayer.bind(null, player.id);
  const [state, dispatch] = useFormState(updatePlayerWithId, initialState);

  return (
      <form action={dispatch}>
          <div className="rounded-md bg-gray-50 p-4 md:p-6">
              {/* player name */}
              <div className="mb-4">
                  <label htmlFor="name" className="mb-2 block text-sm font-medium">
                      Name
                  </label>
                  <div className="relative mt-2 rounded-md">
                      <div className="relative">
                          <input
                              id="name"
                              name="name"
                              defaultValue={player.name}
                              placeholder="Enter Name"
                              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                              aria-describedby="name-error"
                          />
                      </div>
                      <PencilIcon
                          className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
                      <div id="name-error" aria-live="polite" aria-atomic="true">
                          {state.errors?.name &&
                              state.errors.name.map((error: string) => (
                                  <p className="mt-2 text-sm text-red-500" key={error}>
                                      {error}
                                  </p>
                              ))}
                      </div>
                  </div>
              </div>

              {/* player notes */}
              <div className="mb-4">
                  <label htmlFor="notes" className="mb-2 block text-sm font-medium">
                      Notes
                  </label>
                  <div className="relative mt-2 rounded-md">
                      <div className="relative">
                          <input
                              id="notes"
                              name="notes"
                              defaultValue={player.notes}
                              placeholder="Enter Notes"
                              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                              aria-describedby="notes-error"
                          />
                      </div>
                      <PencilIcon
                          className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
                      <div id="notes-error" aria-live="polite" aria-atomic="true">
                          {state.errors?.notes &&
                              state.errors.notes.map((error: string) => (
                                  <p className="mt-2 text-sm text-red-500" key={error}>
                                      {error}
                                  </p>
                              ))}
                      </div>
                  </div>
              </div>

          </div>

          <div className="mt-6 flex justify-end gap-4">
              <Link
                  href="/dashboard/players"
                  className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
                  Cancel
              </Link>
              <Button type="submit">Update player</Button>
          </div>
      </form>
  );
}
