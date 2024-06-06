'use client';

import Link from 'next/link';
import {
  PencilIcon,
  PhoneIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createPlayer } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import {Checkbox} from "primereact/checkbox";
import {useState} from "react";

export default function Form() {
  const initialState = { message: null, errors: {} };

  const [state, dispatch] = useFormState(createPlayer, initialState);
  const [sundayChecked, setSundayChecked] = useState(false);
  const [mondayChecked, setMondayChecked] = useState(false);
  const [tuesdayChecked, setTuesdayChecked] = useState(false);
  const [wednesdayChecked, setWednesdayChecked] = useState(false);
  const [thursdayChecked, setThursdayChecked] = useState(false);
  const [saturdayChecked, setSaturdayChecked] = useState(false);
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

              <PencilIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
            </div>
            <div id="player-error" aria-live="polite" aria-atomic="true">
              {state.errors?.name &&
                  state.errors.name.map((error: string) => (
                      <div className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </div>
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

              <PhoneIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
            </div>
            <div id="phone_number-error" aria-live="polite" aria-atomic="true">
              {state.errors?.phone_number &&
                  state.errors.phone_number.map((error: string) => (
                      <div className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </div>
                  ))}
            </div>
          </div>

          {/* player initial balance */}
          <div className="mb-4">
            <label htmlFor="balance" className="mb-2 block text-sm font-medium">
              Initial Balance
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="balance"
                    name="balance"
                    type="number"
                    step="1"
                    placeholder="Enter ILS balance"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    aria-describedby="balance-error"

                />
                <BanknotesIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
                  </div>
              <div id="balance-error" aria-live="polite" aria-atomic="true">
                {state.errors?.balance &&
                    state.errors.balance.map((error: string) => (
                        <div className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </div>
                    ))}
              </div>
            </div>
          </div>

          {/* note */}
          <div className="mb-4">
            <label htmlFor="note" className="mb-2 block text-sm font-medium">
              Balance Note
            </label>
            <div className="relative">
              <input
                  id="note"
                  name="note"
                  type="text"
                  placeholder="Enter note"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="note-error"

              />

              <PencilIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
            </div>
            <div id="note-error" aria-live="polite" aria-atomic="true">
              {state.errors?.note &&
                  state.errors.note.map((error: string) => (
                      <div className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </div>
                  ))}
            </div>
          </div>

          {/* general notes */}
          <div className="mb-4">
            <label htmlFor="notes" className="mb-2 block text-sm font-medium">
               Notes
            </label>
            <div className="relative">
              <input
                  id="notes"
                  name="notes"
                  type="text"
                  placeholder="Enter notes"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="note-error"

              />

              <PencilIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
            </div>
            <div id="notes-error" aria-live="polite" aria-atomic="true">
              {state.errors?.notes &&
                  state.errors.notes.map((error: string) => (
                      <div className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </div>
                  ))}
            </div>
          </div>

          {/* player rsvp */}
          <div className="mb-4">
            <label htmlFor="notes" className="mb-2 block text-sm font-medium">
              RSVP
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative rsvp-section">
                <div className="flex flex-wrap justify-content-center gap-3">
                  <div className="flex align-items-center">
                    <Checkbox inputId="sunday_rsvp" name="sunday_rsvp" value="sunday_rsvp"
                              checked={sundayChecked}
                              onChange={(e) => setSundayChecked(!!e.checked)}
                    />
                    <label htmlFor="sunday_rsvp" className="ml-2">Sunday</label>
                  </div>
                  <div className="flex align-items-center">
                    <Checkbox inputId="monday_rsvp" name="monday_rsvp" value="monday_rsvp"
                              checked={mondayChecked}
                              onChange={(e) => setMondayChecked(!!e.checked)}
                    />
                    <label htmlFor="monday_rsvp" className="ml-2">Monday</label>
                  </div>
                  <div className="flex align-items-center">
                    <Checkbox inputId="tuesday_rsvp" name="tuesday_rsvp" value="tuesday_rsvp"
                              checked={tuesdayChecked}
                              onChange={(e) => setTuesdayChecked(!!e.checked)}
                    />
                    <label htmlFor="tuesday_rsvp" className="ml-2">Tuesday</label>
                  </div>
                  <div className="flex align-items-center">
                    <Checkbox inputId="wednesday_rsvp" name="wednesday_rsvp" value="wednesday_rsvp"
                              checked={wednesdayChecked}
                              onChange={(e) => setWednesdayChecked(!!e.checked)}
                    />
                    <label htmlFor="wednesday_rsvp" className="ml-2">Wednesday</label>
                  </div>
                  <div className="flex align-items-center">
                    <Checkbox inputId="thursday_rsvp" name="thursday_rsvp" value="thursday_rsvp"
                              checked={thursdayChecked}
                              onChange={(e) => setThursdayChecked(!!e.checked)}
                    />
                    <label htmlFor="thursday_rsvp" className="ml-2">Thursday</label>
                  </div>
                  <div className="flex align-items-center">
                    <Checkbox inputId="saturday_rsvp" name="saturday_rsvp" value="saturday_rsvp"
                              checked={saturdayChecked}
                              onChange={(e) => setSaturdayChecked(!!e.checked)}
                    />
                    <label htmlFor="saturday_rsvp" className="ml-2">Saturday</label>
                  </div>
                </div>
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
