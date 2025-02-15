'use client';
import React from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Button, Tooltip } from 'flowbite-react';
import Link from 'next/link';
import SpinnerButton from '@/app/ui/client/SpinnerButton';
import {  updatePlayer } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { PlayerDB } from '@/app/lib/definitions';

export default function QuickPlayerEditButton({ currentPage, player, userId }: { currentPage:string, userId:string, player:PlayerDB }) {
  const [showModal, setShowModal] = React.useState(false);
  const initialState = { message: null, errors: {} };
  const updatePlayerWithId = updatePlayer.bind(null, {
    id: player.id,
    userId,
    prevPage: currentPage,
  });

  const [state, dispatch] = useFormState(updatePlayerWithId, initialState);
  const close = () => {
    setShowModal(false);
  }
  if (!showModal) {
    return (<Tooltip content="עריכת פרטי שחקן" color="primary">
      <Button
        color="light"
        style={{
          width: 40, paddingRight:15
        }}
      >
        <PencilIcon className="h-5 md:ml-4" onClick={()=>setShowModal(true)}/>
      </Button>
    </Tooltip>
    );
  }

  return (
    <div className="EditPlayerFormWrapper">
      <div className="EditPlayerForm">

        <form action={dispatch}>
          <div className="rtl rounded-md  p-4 md:p-6">
            {/* player name */}
            <div className="mb-4">
              <label htmlFor="name" className="mb-2 block  font-medium">
                שם השחקן
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    defaultValue={player.name}
                    placeholder="הכנס שם"
                    className="peer block w-full rounded-md border  py-2 pl-10  outline-2 player-edit-input"
                    aria-describedby="name-error"
                  />
                </div>
                <PencilIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
                <div id="name-error" aria-live="polite" aria-atomic="true">
                  {state?.errors?.name &&
                    state?.errors.name.map((error: string) => (
                      <div className="mt-2  text-red-500" key={error}>
                        {error}
                      </div>
                    ))}
                </div>
              </div>
            </div>
            {/* player phone number */}
            <div className="mb-4">
              <label
                htmlFor="new_phone_number"
                className="mb-2 block  font-medium"
              >
                מספר הטלפון של השחקן
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="new_phone_number"
                    name="new_phone_number"
                    defaultValue={player.phone_number}
                    placeholder="הכנס מספר"
                    className="peer block w-full rounded-md border  py-2 pl-10  outline-2 player-edit-input"
                    aria-describedby="new_phone_number-error"
                  />
                </div>
                <PencilIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
                <div
                  id="new_phone_number-error"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {state?.errors?.new_phone_number &&
                    state?.errors.new_phone_number.map((error: string) => (
                      <div className="mt-2  text-red-500" key={error}>
                        {error}
                      </div>
                    ))}
                </div>
              </div>
            </div>
            {/* player notes */}
            <div className="mb-4">
              <label htmlFor="notes" className="mb-2 block  font-medium">
                הערות
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="notes"
                    name="notes"
                    defaultValue={player.notes}
                    placeholder="הערות"
                    className="peer block w-full rounded-md border  py-2 pl-10  outline-2 player-edit-input"
                    aria-describedby="notes-error"
                  />
                </div>
                <PencilIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
                <div id="notes-error" aria-live="polite" aria-atomic="true">
                  {state?.errors?.notes &&
                    state?.errors.notes.map((error: string) => (
                      <div className="mt-2  text-red-500" key={error}>
                        {error}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <div
              onClick={close}
              className="my-button-cancel pointer flex h-10 items-center rounded-lg  px-4 pointer font-medium "
            >
              ביטול
            </div>
            <SpinnerButton text="עדכן שחקן" id="submit-button" onClick={()=>{
              setTimeout(close, 2000);
            }}/>
          </div>
        </form>
      </div>
    </div>
  );
}
