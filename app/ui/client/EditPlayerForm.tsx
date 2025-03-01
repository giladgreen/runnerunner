'use client';
// @ts-ignore
import { Circle as SpinningChip } from 'react-awesome-spinners'
import { deletePlayer, updatePlayer } from '@/app/lib/actions';
import { CldUploadWidget } from 'next-cloudinary';
import { PlayerDB, TournamentDB } from '@/app/lib/definitions';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { PencilIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import SpinnerButton, { RedSpinnerButton } from '@/app/ui/client/SpinnerButton';
import AreYouSure from '@/app/ui/client/AreYouSure';
import * as FlowbiteReact from 'flowbite-react';
import { getRSVPSForTheNextWeek } from '@/app/lib/clientUtils';

export default function EditPlayerForm({
  player,
  tournaments,
  rsvpEnabled,
  userId,
  isAdmin,
}: {
  userId: string;
  player: PlayerDB;
  rsvpEnabled: boolean;
  isAdmin?: boolean;
  tournaments: TournamentDB[];
}) {
  const [showDeletePlayerConfirmation, setShowDeletePlayerConfirmation] =
    useState(false);
  const [isDeletePlayerPending, setIsDeletePlayerPending] = useState(false);

  const initialState = { message: null, errors: {} };
  const initialState2 = { message: null, errors: {} };
  const updatePlayerWithId = updatePlayer.bind(null, {
    id: player.id,
    userId,
    prevPage: `/${userId}/players`,
  });
  const deletePlayerWithId = deletePlayer.bind(null, {
    id: player.id,
    prevPage: '/',
    userId,
  });
  const [imageUrl, setImageUrl] = useState(
    player.image_url ?? '/players/default.png',
  );

  const [state, dispatch] = useFormState(updatePlayerWithId, initialState);

  const [_state2, deletePlayerDispatch] = useFormState(
    deletePlayerWithId,
    // @ts-ignore
    initialState2,
  );

  const rsvpsForTheNextWeek = getRSVPSForTheNextWeek(
    tournaments,
    player,
    false,
    true,
  );

  return (
    <>
      {isAdmin && (
        <div>
          <div
            onClick={() => {
              setShowDeletePlayerConfirmation(true);
            }}
            className="pointer"
          >
            {isDeletePlayerPending ? (
              <SpinningChip color="var(--white)"  size={20}/>
            ) : (
              <RedSpinnerButton text="מחק שחקן" />
            )}
          </div>
          {showDeletePlayerConfirmation && (
            <AreYouSure
              onConfirm={() => {
                setShowDeletePlayerConfirmation(false);
                setIsDeletePlayerPending(true);
                deletePlayerDispatch();
                setTimeout(() => setIsDeletePlayerPending(false), 2600);
              }}
              onCancel={() => {
                setShowDeletePlayerConfirmation(false);
              }}
              action="מחיקת שחן - הפעולה אינה הפיכה"
              question="האם אתה בטוח?"
            />
          )}
        </div>
      )}
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
              <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
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
              <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
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
              <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
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
        {/* player image url */}
        <div className="rtl mb-4">
          <label htmlFor="image_url" className="mb-2 block  font-medium">
            כתובת תמונה
          </label>
          <div className="relative">
            <input
              id="image_url"
              name="image_url"
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="peer block w-full rounded-md border  py-2 pl-10  outline-2 player-edit-input"
              aria-describedby="image_url-error"
            />
          </div>
          {imageUrl && (
            <div
              style={{
                marginTop: 4,
                alignSelf: 'right',
                alignItems: 'right',
                width: 40,
                alignContent: 'right',
              }}
            >
              <FlowbiteReact.Avatar
                img={imageUrl}
                size="md"
                className="zoom-on-hover"
              />
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href={`/${userId}/current_tournament`}
            className="my-button-cancel flex h-10 items-center rounded-lg  px-4  font-medium pointer"
          >
            ביטול
          </Link>
          <SpinnerButton text="עדכן שחקן" id="submit-button" />
        </div>
      </form>
      <div
        className="flex h-10 items-center rounded-lg  px-4  font-medium  transition-colors "
        style={{ width: '130px' }}
      >
        <CldUploadWidget
          signatureEndpoint="/api/sign-image"
          options={{ sources: ['local', 'url', 'camera'] }}
          onSuccess={(response) => {
            // @ts-ignore
            const url = response?.info?.url;
            setImageUrl(url);
            setTimeout(() => {
              document.getElementById('submit-button')?.click();
            }, 1000);
          }}
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
      {rsvpEnabled && (
        <div
          className="rtl"
          style={{
            marginTop: 45,
            border: '2px solid blue',
            borderRadius: 5,
            padding: 10,
          }}
        >
          <div className="rtl align-text-right" >
            <u>אישורי הגעה לשבוע הקרוב</u>
          </div>
          <div>{rsvpsForTheNextWeek}</div>
        </div>
      )}
    </>
  );
}
