'use client';
import { updateTournament } from '@/app/lib/actions';

import {
  TournamentDB,
  TournamentForm,
  TRANSLATIONS,
} from '@/app/lib/definitions';

import Link from 'next/link';
import Button from '@/app/ui/client/Button';
import { useFormState, useFormStatus } from 'react-dom';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Checkbox } from 'primereact/checkbox';
import React, { useState } from 'react';
import Spinner from '@/app/ui/client/Spinner';
import SpinnerButton from '@/app/ui/client/SpinnerButton';

export default function EditTournamentForm({
  tournament,
  userId,
  prevPage,
}: {
  tournament: TournamentDB;
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
      <div
        className="rtl rounded-md bg-gray-50 p-4 md:p-6"
        style={{ textAlign: 'right' }}
      >
        {/* Day */}
        <div className="mb-4">
          <label
            htmlFor="day"
            className="mb-2 block text-sm font-medium"
            style={{ textAlign: 'right' }}
          ></label>
          <div
            className="relative mt-2 rounded-md"
            style={{ textAlign: 'right', zoom: 2 }}
          >
            {
              // @ts-ignore
              TRANSLATIONS[tournament.day]
            }
          </div>
        </div>

        {/* tournament name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium"
            style={{ textAlign: 'right' }}
          >
            שם
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                defaultValue={tournament.name}
                placeholder="שם"
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

        {/* tournament time */}
        <div className="mb-4">
          <label
            htmlFor="start_time"
            className="mb-2 block text-sm font-medium"
            style={{ textAlign: 'right' }}
          >
           שעת התחלה
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="start_time"
                name="start_time"
                defaultValue={tournament.start_time}
                placeholder="  שעת התחלה"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="start_time-error"
              />
            </div>
            <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            <div id="start_time-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.start_time &&
                state?.errors.start_time.map((error: string) => (
                  <div className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* initial_stack */}
        <div className="mb-4">
          <label
            htmlFor="initial_stack"
            className="mb-2 block text-sm font-medium"
            style={{ textAlign: 'right' }}
          >
            ערימה התחלתית
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="initial_stack"
                name="initial_stack"
                type="number"
                min={0}
                defaultValue={tournament.initial_stack}
                placeholder="  ערימה התחלתית"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="buy_in-error"
              />
            </div>
            <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            <div id="initial_stack-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.initial_stack &&
                state?.errors.initial_stack.map((error: string) => (
                  <div className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* buy_in */}
        <div className="mb-4">
          <label
            htmlFor="buy_in"
            className="mb-2 block text-sm font-medium"
            style={{ textAlign: 'right' }}
          >
            עלות כניסה
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="buy_in"
                name="buy_in"
                type="number"
                min={0}
                defaultValue={tournament.buy_in}
                placeholder="כניסה"
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
          <label
            htmlFor="re_buy"
            className="mb-2 block text-sm font-medium"
            style={{ textAlign: 'right' }}
          >
            עלות כניסה נוספת
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="re_buy"
                name="re_buy"
                type="number"
                min={0}
                defaultValue={tournament.re_buy}
                placeholder="כניסה מחדש"
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

        {/* phase_length */}
        <div className="mb-4">
          <label
            htmlFor="phase_length"
            className="mb-2 block text-sm font-medium"
            style={{ textAlign: 'right' }}
          >
            משך שלב
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="phase_length"
                name="phase_length"
                type="number"
                min={0}
                defaultValue={tournament.phase_length}
                placeholder=" משך שלב"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="phase_length-error"
              />
            </div>
            <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            <div id="phase_length-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.phase_length &&
                state?.errors.phase_length.map((error: string) => (
                  <div className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </div>
                ))}
            </div>
          </div>
        </div>


        {/* last_phase_for_rebuy */}
        <div className="mb-4">
          <label
            htmlFor="last_phase_for_rebuy"
            className="mb-2 block text-sm font-medium"
            style={{ textAlign: 'right' }}
          >
            שלב אחרון לכניסה נוספת
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="last_phase_for_rebuy"
                name="last_phase_for_rebuy"
                type="number"
                min={0}
                defaultValue={tournament.last_phase_for_rebuy}
                placeholder=" שלב אחרון לכניסה נוספת"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="last_phase_for_rebuy-error"
              />
            </div>
            <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            <div id="last_phase_for_rebuy-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.last_phase_for_rebuy &&
                state?.errors.last_phase_for_rebuy.map((error: string) => (
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
            style={{ textAlign: 'right' }}
          >
            מספר שחקנים מירבי
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="max_players"
                name="max_players"
                type="number"
                min={0}
                defaultValue={tournament.max_players}
                placeholder="כמות מקסימלית של שחקנים"
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
            style={{ marginTop: 10, textAlign: 'right' }}
          >
            האם נדרש אישור הגעה
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
          ביטול
        </Link>
        <SpinnerButton text="עדכן טורניר" />
      </div>
    </form>
  );
}
