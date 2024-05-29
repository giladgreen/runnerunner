'use client';
import { updatePlayer } from '@/app/lib/actions';

import { PlayerForm } from '@/app/lib/definitions';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import {useFormState} from "react-dom";
import Image from "next/image";

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

            {/* player phone_number */}
            <div className="mb-4">
                <label htmlFor="phone_number" className="mb-2 block text-sm font-medium">
                    Phone Number
                </label>
                <div className="relative mt-2 rounded-md">
                    <div className="relative">
                        <input
                            id="phone_number"
                            name="phone_number"
                            defaultValue={player.phone_number}
                            placeholder="Enter Phone Number"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="phone_number-error"
                        />
                    </div>
                    <div id="phone_number-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.phone_number &&
                            state.errors.phone_number.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>
            </div>

          {/* player balance */}
          <div className="mb-4">
            <label htmlFor="balance" className="mb-2 block text-sm font-medium">
              Balance
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="balance"
                    name="balance"
                    type="number"
                    step="10"
                    defaultValue={player.balance}
                    placeholder="Enter ILS balance"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    aria-describedby="balance-error"
                />
               </div>
              <div id="balance-error" aria-live="polite" aria-atomic="true">
                {state.errors?.balance &&
                    state.errors.balance.map((error: string) => (
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
