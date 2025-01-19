'use client';

import { PencilIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import Button from '@/app/ui/client/Button';
import { TournamentAdjustmentLog } from '@/app/lib/actions';
import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';
import Spinner from '@/app/ui/client/Spinner';
import { RingLoader } from 'react-spinners';

export default function TournamentAdjustmentForm({
  hide,
  prevPage,
  userId,
  tournamentId,
}: {
  tournamentId: string;
  prevPage: string;
  hide?: () => void;
  userId: string;
}) {
  const initialState = { message: null, errors: {} };
  const [isPending, setIsPending] = useState(false);

  const TournamentAdjustmentLogWithExtraData = TournamentAdjustmentLog.bind(
    null,
    {
      prevPage,
      userId,
      tournamentId,
    },
  );

  // @ts-ignore
  const [state1, dispatch] = useFormState(
    // @ts-ignore
    TournamentAdjustmentLogWithExtraData,
    initialState,
  );

  const [note, setNote] = useState('מוסיף \\ מוריד בגלל ש..');

  const [type, setType] = useState('cash');

  function SubmitButton() {
    const { pending } = useFormStatus();
    useEffect(() => {
      if (pending) {
        setTimeout(() => {
          hide?.();
        }, 1800);
      }
      setIsPending(pending);
    }, [pending]);

    if (pending) {
      return <RingLoader color="var(--white)" loading={true} size={40} style={{ marginRight: 30 }} />;
    }
    return (
      <Button
        type="submit"
        disabled={pending}
        className={pending ? ' gray-on-hover bg-gray-500' : ''}
      >
        שלח
      </Button>
    );
  }

  function CancelButton() {
    if (isPending) {
      return null;
    }

    return (
      <button className="my-button-cancel flex h-10 items-center rounded-lg  px-4 text-sm font-medium" onClick={hide} style={{ marginTop: -52, marginRight: 20 }}>
        ביטול
      </button>
    );
  }

  return (
    <div
      className="edit-player-modal-inner-div rtl align-text-right"

    >
      <form action={dispatch} className="form-control">
        <div className="form-inner-control  rounded-md p-4 md:p-6">
          {/*  change */}
          <div className="mb-4">
            <label htmlFor="change" className="mb-2 block text-sm font-medium">
              סכום
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="change"
                  name="change"
                  type="number"
                  placeholder="סכום"
                  className="peer block w-full rounded-md border  py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="change-error"
                />
                <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
              </div>
            </div>
          </div>

          {/* note */}
          <div className="mb-4">
            <label htmlFor="note" className="mb-2 block text-sm font-medium">
              סיבה
            </label>
            <div className="relative">
              <input
                id="note"
                name="note"
                type="text"
                placeholder="הערה"
                className="peer block w-full rounded-md border  py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="note-error"
                required
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                }}
              />

              <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
            </div>
          </div>

          {/* type */}
          <div className="rtl relative mt-2 rounded-md">
            <div className="rsvp-section relative">
              <div className="justify-content-center radio flex flex-wrap gap-3">
                <div className="align-items-center flex">
                  <input
                    type="radio"
                    value="cash"
                    name="type"
                    checked={type === 'cash'}
                    onChange={() => setType('cash')}
                  />
                  <label htmlFor="cash" className="ml-2">
                    מזומן
                  </label>
                </div>
                <div className="align-items-center flex">
                  <input
                    type="radio"
                    value="wire"
                    name="type"
                    checked={type === 'wire'}
                    onChange={() => setType('wire')}
                  />
                  <label htmlFor="wire" className="ml-2">
                    העברה
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <SubmitButton />
        </div>
      </form>
      {hide && <CancelButton />}
    </div>
  );
}
