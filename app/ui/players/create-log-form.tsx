'use client';

import {
  PencilIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import {createPlayerNewCreditLog, createPlayerUsageLog} from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import {PlayerForm} from "@/app/lib/definitions";
import {useState} from "react";
const TEXTS = {
  Sunday: 'טורניר קיסריה - כניסה',
  Monday: 'טורניר תל אביב - כניסה',
  Tuesday: 'טורניר רעננה - כניסה',
  Wednesday: 'טורניר כפר סבא - כניסה',
  Thursday: 'טורניר ראשל״צ - כניסה',
  Saturday: 'טורניר ראשל״צ - כניסה',
}

const AMOUNTS = {
  Sunday: 250,
  Monday: 300,
  Tuesday: 300,
  Wednesday: 250,
  Thursday: 400,
  Saturday: 300,
}

function getInitialText(): string {
  const now = new Date();
  const dayOfTheWeek = now.toLocaleString('en-us', { weekday: 'long' });

  // @ts-ignore
  const result: string = TEXTS[dayOfTheWeek] ? TEXTS[dayOfTheWeek] as string : '';

  return result;
}

function getInitialAmount(): number {
  const now = new Date();
  const dayOfTheWeek = now.toLocaleString('en-us', { weekday: 'long' });

  // @ts-ignore
  const result: number = AMOUNTS[dayOfTheWeek] ? AMOUNTS[dayOfTheWeek] as number : 300;

  return result;
}


export default function Form({player} : {player: PlayerForm}) {
  const initialState = { message: null, errors: {} };
  const createPlayerUsageLogWithPlayerData = createPlayerUsageLog.bind(null, player);
  const createPlayerNewCreditLogWithPlayerData = createPlayerNewCreditLog.bind(null, player);

  const initialText = getInitialText();
  const initialAmount = getInitialAmount();
  const [note, setNote] = useState(initialText);
  const [amount, setAmount] = useState(initialAmount);
  // @ts-ignore
  const [state1, dispatch1] = useFormState(createPlayerUsageLogWithPlayerData, initialState);
  // @ts-ignore
  const [state2, dispatch2] = useFormState(createPlayerNewCreditLogWithPlayerData, initialState);

  return (
      <div style={{ display: 'flex'}}>

        <form action={dispatch1}>
          <label className="mb-2 block text-sm font-medium">
            Balance usage
          </label>
          <div className="rounded-md bg-gray-50 p-4 md:p-6">
            {/*  balance change */}
            <div className="mb-4">
              <label htmlFor="change" className="mb-2 block text-sm font-medium">
                Amount
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                      id="change"
                      name="change"
                      type="number"
                      step="10"
                      min={0}
                      placeholder="Enter ILS amount"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                      aria-describedby="change-error"
                      onChange={(e) => setAmount(Number(e.target.value))}
                      value={amount}
                  />
                  <BanknotesIcon
                      className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
                </div>
                <div id="change-error" aria-live="polite" aria-atomic="true">
                  {state1?.errors?.change &&
                      state1?.errors.change.map((error: string) => (
                          <p className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                          </p>
                      ))}
                </div>
              </div>
            </div>

            {/* note */}
            <div className="mb-4">
              <label htmlFor="note" className="mb-2 block text-sm font-medium">
                Note
              </label>
              <div className="relative">
                <input
                    id="note"
                    name="note"
                    type="text"
                    placeholder="Enter note"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    aria-describedby="note-error"
                    onChange={(e) => setNote(e.target.value)}
                    value={note}
                />

                <PencilIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
              </div>
              <div id="note-error" aria-live="polite" aria-atomic="true">
                {state1?.errors?.note &&
                    state1?.errors.note.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button type="submit">Use Balance</Button>
          </div>
        </form>
        <form action={dispatch2} style={{ marginLeft: 100}}>
          <label className="mb-2 block text-sm font-medium">
            Player Credit
          </label>
          <div className="rounded-md bg-gray-50 p-4 md:p-6">

            {/*  balance change */}
            <div className="mb-4">
              <label htmlFor="change" className="mb-2 block text-sm font-medium">
                Added Credit
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                      id="change"
                      name="change"
                      type="number"
                      step="10"
                      min={0}
                      placeholder="Enter ILS change"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                      aria-describedby="change-error"

                  />
                  <BanknotesIcon
                      className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
                </div>
                <div id="change-error" aria-live="polite" aria-atomic="true">
                  {state2?.errors?.change &&
                      state2?.errors?.change.map((error: string) => (
                          <p className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                          </p>
                      ))}
                </div>
              </div>
            </div>

            {/* note */}
            <div className="mb-4">
              <label htmlFor="note" className="mb-2 block text-sm font-medium">
                Note
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
                {state2?.errors?.note &&
                    state2?.errors.note.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button type="submit">Add To Balance</Button>
          </div>
        </form>
      </div>
  );
}
