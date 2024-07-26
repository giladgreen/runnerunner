'use client';

import { PencilIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import Button from '@/app/ui/client/Button';
import {
  createPlayerNewCreditLog,
  createPlayerUsageLog,
} from '@/app/lib/actions';
import { useFormState, useFormStatus } from 'react-dom';
import { PlayerDB, PlayerForm } from '@/app/lib/definitions';
import React, { useState } from 'react';
import Image from 'next/image';
import Spinner from '@/app/ui/client/Spinner';
import SpinnerButton from '@/app/ui/client/SpinnerButton';

export function UseCreditForPrizeForm({
  player,
  userId,
  prevPage,
}: {
  player: PlayerForm;
  userId: string;
  prevPage: string;
}) {
  const initialState = { message: null, errors: {} };

  const createPlayerUsageLogWithPlayerData = createPlayerUsageLog.bind(null, {
    player,
    prevPage,
    userId,
  });

  const initialText = `שחקן המיר קרדיט בפרס`;
  const initialAmount = 1000;
  const [note, setNote] = useState(initialText);
  const [amount, setAmount] = useState(initialAmount);
  // @ts-ignore
  const [state1, dispatch] = useFormState(
    // @ts-ignore
    createPlayerUsageLogWithPlayerData,
    initialState,
  );

  const [type, setType] = useState('prize');

  return (
    <form action={dispatch} className="form-control">
      <label className="mb-2 block text-sm font-medium" style={{ textAlign: 'right'}}>
        שימוש בקרדיט לטובת פרס
      </label>
      <div className="form-inner-control  rounded-md p-4 md:p-6">
        {/*  balance change */}
        <div className="mb-4">
          <label htmlFor="change" className="mb-2 block text-sm font-medium" style={{ textAlign: 'right'}}>
            סכום
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative rtl">
              <input
                id="change"
                name="change"
                type="number"
                step="1"
                min={0}
                placeholder="הכנס סכום"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="change-error"
                onChange={(e) => {
                  setAmount(Number(e.target.value));
                }}
                value={amount}
              />
              <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="change-error" aria-live="polite" aria-atomic="true">
              {state1?.errors?.change &&
                state1?.errors.change.map((error: string) => (
                  <div className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* note */}
        <div className="mb-4">
          <label htmlFor="note" className="mb-2 block text-sm font-medium" style={{ textAlign: 'right'}}>
            הערה
          </label>
          <div className="relative rtl">
            <input
              id="note"
              name="note"
              type="text"
              placeholder="הערה"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="note-error"
              onChange={(e) => {
                setNote(e.target.value);
              }}
              required
              value={note}
            />

            <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="note-error" aria-live="polite" aria-atomic="true">
            {state1?.errors?.note &&
              state1?.errors.note.map((error: string) => (
                <div className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </div>
              ))}
          </div>
        </div>

        {/* type */}
        <div className="relative mt-2 rounded-md">
          <div className="rsvp-section relative">
            <div className="justify-content-center radio flex flex-wrap gap-3">
              <div className="align-items-center flex" style={{ opacity: 0.2 }}>
                <input
                  type="radio"
                  value="prize"
                  name="type"
                  checked={type === 'prize'}
                  onChange={() => setType('prize')}
                  disabled
                />
                <label htmlFor="credit" className="ml-2">
                  פרס
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <UseCreditButton />
      </div>
    </form>
  );
}
function UseCreditButton() {
  const { pending } = useFormStatus();

  if (pending) {
    return <Spinner size={33} />;
  }
  return <Button type="submit">השתמש בקרדיט</Button>;
}

export function AddToBalanceForm({
  player,
  userId,
  prevPage,
}: {
  player: PlayerForm;
  userId: string;
  prevPage: string;
}) {
  const initialState = { message: null, errors: {} };

  const createPlayerNewCreditLogWithPlayerData = createPlayerNewCreditLog.bind(
    null,
    { player, prevPage, userId },
  );
  // @ts-ignore
  const [state2, dispatch] = useFormState(
    // @ts-ignore
    createPlayerNewCreditLogWithPlayerData,
    initialState,
  );

  return (
    <form
      action={dispatch}
      className="form-control"
      style={{ margin: '5px 0' }}
    >
      <label className="mb-2 block text-sm font-medium" style={{ textAlign: 'right'}}>
        הוספת קרדיט לשחקן
      </label>
      <div className="form-inner-control rounded-md p-4 md:p-6">
        {/*  balance change */}
        <div className="mb-4">
          <label htmlFor="change" className="mb-2 block text-sm font-medium" style={{ textAlign: 'right'}}>
            סכום
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative rtl">
              <input
                id="change"
                name="change"
                type="number"
                step="1"
                min={0}
                required
                placeholder="הכנס סכום"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="change-error"
              />
              <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="change-error" aria-live="polite" aria-atomic="true">
              {state2?.errors?.change &&
                state2?.errors?.change.map((error: string) => (
                  <div className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* note */}
        <div className="mb-4">
          <label htmlFor="note" className="mb-2 block text-sm font-medium" style={{ textAlign: 'right'}}>
            הערה
          </label>
          <div className="relative rtl">
            <input
              id="note"
              name="note"
              type="text"
              placeholder="הכנס סיבה"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="note-error"
            />

            <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="note-error" aria-live="polite" aria-atomic="true">
            {state2?.errors?.note &&
              state2?.errors.note.map((error: string) => (
                <div className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <SpinnerButton text="הוסף" />
      </div>
    </form>
  );
}

export default function CreateLogForm({
  player,
  userId,
  prevPage,
  isAdmin,
}: {
  player: PlayerDB;
  prevPage: string;
  userId: string;
  isAdmin: boolean;
}) {
  return (
    <div>
      <div className="cellular">
        <div style={{ display: 'block' }}>
          <Image
            src={player.image_url}
            className=" mr-2"
            width={100}
            height={100}
            alt={`profile picture`}
          />
          {isAdmin && (
            <AddToBalanceForm
              player={player}
              prevPage={prevPage}
              userId={userId}
            />
          )}
          <UseCreditForPrizeForm
            player={player}
            prevPage={prevPage}
            userId={userId}
          />
        </div>
      </div>

      <div className="wide-screen" style={{ justifyContent: 'space-between' }}>
        {isAdmin && (
          <AddToBalanceForm
            player={player}
            prevPage={prevPage}
            userId={userId}
          />
        )}
        <Image
          src={player.image_url}
          className="mr-2"
          width={300}
          height={500}
          alt={`profile picture`}
        />
        <UseCreditForPrizeForm
          player={player}
          prevPage={prevPage}
          userId={userId}
        />
      </div>
    </div>
  );
}
