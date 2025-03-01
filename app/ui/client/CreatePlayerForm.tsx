'use client';
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import { useSearchParams } from 'next/navigation';
import {
  PencilIcon,
  PhoneIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import { createPlayer } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import React, { useState } from 'react';
import SpinnerButton from '@/app/ui/client/SpinnerButton';

export default function CreatePlayerForm({
  prevPage,
  close
}: {
  prevPage: string;
  close: ()=>void;
}) {
  const initialState = { message: null, errors: {} };
  const searchParams = useSearchParams();

  const query = searchParams.get('query');

  const createPlayerWithPrevPage = createPlayer.bind(null, prevPage);
  // @ts-ignore
  const [state, dispatch] = useFormState(
    // @ts-ignore
    createPlayerWithPrevPage,
    initialState,
  );
  const initialPhoneNumber = query && !isNaN(Number(query)) ? query : '';
  const initialName = query && isNaN(Number(query)) ? query : '';

  const [name, setName] = useState(initialName);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [balanceNote, setBalanceNote] = useState('שחקן חדש');
  const [imageUrl, setImageUrl] = useState('');
  const [balance, setBalance] = useState(0);

  // @ts-ignore
  const onImageUploaded = (response)=>{
  // @ts-ignore
  setImageUrl(response?.info?.url);
}
  return (
    <div className="CreatePlayerForm">
      <form action={dispatch}>
        <div className="my-form rtl rounded-md  p-4 md:p-6">
          {/* player Name */}
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block  font-medium">
              שם
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="הכנס שם"
                className="peer block w-full rounded-md border  py-2 pl-10  outline-2 "
                aria-describedby="name-error"
              />

              <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
            </div>
            <div id="player-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.name &&
                state?.errors.name.map((error: string) => (
                  <div className="mt-2  text-red-500" key={error}>
                    {error}
                  </div>
                ))}
            </div>
          </div>

          {/* player phone_number */}
          <div className="mb-4">
            <label
              htmlFor="phone_number"
              className="mb-2 block  font-medium"
            >
              מספר טלפון
            </label>
            <div className="relative">
              <input
                id="phone_number"
                name="phone_number"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="הכנס מספר טלפון"
                className="peer block w-full rounded-md border  py-2 pl-10  outline-2 "
                aria-describedby="phone_number-error"
              />

              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
            </div>
            <div id="phone_number-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.phone_number &&
                state?.errors.phone_number.map((error: string) => (
                  <div className="mt-2  text-red-500" key={error}>
                    {error}
                  </div>
                ))}
            </div>
          </div>

          {/* player initial balance */}
          <div className="mb-4">
            <label htmlFor="balance" className="mb-2 block  font-medium">
              קרדיט קיים
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="balance"
                  name="balance"
                  type="number"
                  step="1"
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                  placeholder="הכנס קרדיט אם יש"
                  className="peer block w-full rounded-md border  py-2 pl-10  outline-2 "
                  aria-describedby="balance-error"
                />
                <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
              </div>
              <div id="balance-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.balance &&
                  state?.errors.balance.map((error: string) => (
                    <div className="mt-2  text-red-500" key={error}>
                      {error}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* note */}
          <div className="mb-4">
            <label htmlFor="note" className="mb-2 block  font-medium">
              הערה על הקרדיט הקיים
            </label>
            <div className="relative">
              <input
                id="note"
                name="note"
                type="text"
                value={balanceNote}
                onChange={(e) => setBalanceNote(e.target.value)}
                placeholder="הערה"
                className="peer block w-full rounded-md border  py-2 pl-10  outline-2 "
                aria-describedby="note-error"
              />

              <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
            </div>
            <div id="note-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.note &&
                state?.errors.note.map((error: string) => (
                  <div className="mt-2  text-red-500" key={error}>
                    {error}
                  </div>
                ))}
            </div>
          </div>

          {/* general notes */}
          <div className="mb-4">
            <label htmlFor="notes" className="mb-2 block  font-medium">
              הערות על השחקן
            </label>
            <div className="relative">
              <input
                id="notes"
                name="notes"
                type="text"
                placeholder="הערות"
                className="peer block w-full rounded-md border  py-2 pl-10  outline-2 "
                aria-describedby="note-error"
              />

              <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
            </div>
            <div id="notes-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.notes &&
                state?.errors.notes.map((error: string) => (
                  <div className="mt-2  text-red-500" key={error}>
                    {error}
                  </div>
                ))}
            </div>
          </div>

          {/* player image url */}
          <div className="mb-4">
            <label
              htmlFor="image_url"
              className="mb-2 block  font-medium"
            >
              כתובת תמונה
            </label>
            <div className="relative">
              <input
                id="image_url"
                name="image_url"
                type="text"
                value={imageUrl}
                className="peer block w-full rounded-md border  py-2 pl-10  outline-2 "
                aria-describedby="image_url-error"
              />
            </div>
            {imageUrl && (
              <CldImage
                src={imageUrl}
                width={60}
                height={60}
                style={{ marginTop: 20 }}
                alt=""
              />
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <div
            onClick={close}
            className="my-button-cancel pointer flex h-10 items-center rounded-lg  px-4  font-medium pointer"
          >
            ביטול
          </div>
          <SpinnerButton text="צור שחקן" onClick={()=>{
            setTimeout(close, 2000);
          }}/>
        </div>
      </form>
       <div
        className="flex h-10 items-center rounded-lg  px-4  font-medium "
        style={{ width: '130px', zIndex:999999999 }}
      >
        <CldUploadWidget
          signatureEndpoint="/api/sign-image"
          options={{ sources: ['local', 'url', 'camera'] }}
          onSuccess={onImageUploaded}
        >
          {({ open }) => {
            return (
              <button
                className="my-button"
                onClick={() => {
                  open();
                }}
              >
                העלה תמונה
              </button>
            );
          }}
        </CldUploadWidget>
      </div>
    </div>
  );
}
