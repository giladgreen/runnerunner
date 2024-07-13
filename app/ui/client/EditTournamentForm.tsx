'use client';
import { updateTournament } from '@/app/lib/actions';

import { TournamentForm } from '@/app/lib/definitions';

import Link from 'next/link';
import Button from '@/app/ui/client/Button';
import { useFormState } from 'react-dom';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Checkbox } from 'primereact/checkbox';
import { useState } from 'react';

export default function EditTournamentForm({
  tournament,
  userId,
  prevPage,
}: {
  tournament: TournamentForm;
  userId: string;
  prevPage: string;
}) {
  const initialState = { message: null, errors: {} };

  const updateTournamentWithId = updateTournament.bind(null, {
    id: tournament.id,
    prevPage,
  });

  const [state, dispatch] = useFormState(updateTournamentWithId, initialState);
  const [rsvpRequired, setRsvpRequired] = useState(tournament.rsvp_required);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Day */}
        <div className="mb-4">
          <label htmlFor="day" className="mb-2 block text-sm font-medium">
            Day
          </label>
          <div className="relative mt-2 rounded-md">{tournament.day}</div>
        </div>

        {/* tournament name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                defaultValue={tournament.name}
                placeholder="Enter name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="name-error"
              />
            </div>
            <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.name &&
                state?.errors.name.map((error: string) => (
                  <div className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* buy_in */}
        <div className="mb-4">
          <label htmlFor="buy_in" className="mb-2 block text-sm font-medium">
            Buy In
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="buy_in"
                name="buy_in"
                type="number"
                min={0}
                defaultValue={tournament.buy_in}
                placeholder="Enter Buy In"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="buy_in-error"
              />
            </div>
            <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            <div id="buy_in-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.buy_in &&
                state?.errors.buy_in.map((error: string) => (
                  <div className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/* re_buy */}
        <div className="mb-4">
          <label htmlFor="re_buy" className="mb-2 block text-sm font-medium">
            Re-Buy
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="re_buy"
                name="re_buy"
                type="number"
                min={0}
                defaultValue={tournament.re_buy}
                placeholder="Enter Re-Buy"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="re_buy-error"
              />
            </div>
            <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            <div id="re_buy-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.re_buy &&
                state?.errors.re_buy.map((error: string) => (
                  <div className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/* max_players */}
        <div className="rsvp-section mb-4">
          <label
            htmlFor="max_players"
            className="mb-2 block text-sm font-medium"
          >
            Max Players
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="max_players"
                name="max_players"
                type="number"
                min={0}
                defaultValue={tournament.max_players}
                placeholder="Enter Max Players"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="max_players-error"
              />
            </div>
            <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />

            <div id="max_players-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.max_players &&
                state?.errors.max_players.map((error: string) => (
                  <div className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </div>
                ))}
            </div>
          </div>
          <label
            htmlFor="rsvp_required"
            className="mb-2 block text-sm font-medium"
            style={{ marginTop: 10 }}
          >
            RSVP Required
          </label>
          <Checkbox
            inputId="rsvp_required"
            name="rsvp_required"
            value="rsvp_required"
            checked={rsvpRequired}
            onChange={(e) => setRsvpRequired(!!e.checked)}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={`/${userId}/configurations/tournaments`}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Update tournament</Button>
      </div>
    </form>
  );
}
