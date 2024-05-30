'use client';

import Link from 'next/link';
import {
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createPlayer } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

export default function Form() {
  const initialState = { message: null, errors: {} };

  const [state, dispatch] = useFormState(createPlayer, initialState);

  return (
      <form action={dispatch}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* player Name */}
          <div className="mb-4">
            <label htmlFor="player" className="mb-2 block text-sm font-medium">
              Choose Name
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

              <UserCircleIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
            </div>
            <div id="player-error" aria-live="polite" aria-atomic="true">
              {state.errors?.name &&
                  state.errors.name.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                  ))}
            </div>
          </div>

          {/* player phone_number */}
          <div className="mb-4">
            <label htmlFor="phone_number" className="mb-2 block text-sm font-medium">
              Choose Phone number
            </label>
            <div className="relative">
              <input
                  id="phone_number"
                  name="phone_number"
                  type="text"
                  placeholder="Enter phone_number"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="phone_number-error"

              />

              <UserCircleIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
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

          {/* player balance */}
          <div className="mb-4">
            <label htmlFor="balance" className="mb-2 block text-sm font-medium">
              Choose an balance
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="balance"
                    name="balance"
                    type="number"
                    step="10"
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
          <Button type="submit">Create Player</Button>
        </div>
      </form>
  );
}
