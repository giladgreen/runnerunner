'use client';
import {deletePlayer, updatePlayer} from '@/app/lib/actions';
import { CldUploadWidget } from 'next-cloudinary';

import { PlayerDB, TournamentDB } from '@/app/lib/definitions';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { PencilIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import RSVPButton from '@/app/ui/client/RSVPButton';
import { usePathname, useSearchParams } from 'next/navigation';
import { TRANSLATIONS } from '@/app/lib/definitions';
import Image from 'next/image';
import SpinnerButton, {RedSpinnerButton} from '@/app/ui/client/SpinnerButton';
import { getCurrentDate, getDayOfTheWeek } from '@/app/lib/clientDateUtils';

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
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;
  const initialState = { message: null, errors: {} };
  const initialState2 = { message: null, errors: {} };
  const updatePlayerWithId = updatePlayer.bind(null, {
    id: player.id,
    prevPage,
  });
  const deletePlayerWithId = deletePlayer.bind(null, {
    id: player.id,
    prevPage: '/',
  });
  const [imageUrl, setImageUrl] = useState(
    player.image_url ?? '/players/default.png',
  );

  const [state, dispatch] = useFormState(updatePlayerWithId, initialState);
  // @ts-ignore
  const [_state2, deletePlayerDispatch] = useFormState(deletePlayerWithId, initialState2);

  const dayOfTheWeek = getDayOfTheWeek();
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const today = days.indexOf(dayOfTheWeek);

  const rsvpsForTheNextWeek = tournaments
    .filter((tournament) => days.indexOf(tournament.day) >= today)
    .map((tournament) => {
      const tournamentDayIndex = days.indexOf(tournament.day);
      const date = getCurrentDate(
        getCurrentDate().getTime() +
          1000 * 60 * 60 * 24 * (tournamentDayIndex - today),
      );
      const dayOfTheWeek = getDayOfTheWeek(date.getTime());
      const stringDate = date.toISOString().slice(0, 10);
      // @ts-ignore
      const text = ` ${TRANSLATIONS[dayOfTheWeek]} - ${tournament.name}`;
      return (
        <div key={tournament.id} className="tournament_rsvp_line">
          {tournament.rsvp_required ? (
            tournament.max_players === 0 ? (
              ''
            ) : (
              <RSVPButton
                player={player as PlayerDB}
                stringDate={stringDate}
                text={text}
                tournamentId={tournament.id}
              />
            )
          ) : (
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  border: '1px solid black',
                  background: '#AAAAAA',
                  width: 26,
                  height: 26,
                  margin: '0 8px',
                  cursor: 'no-drop',
                }}
              />
              {text}
            </div>
          )}
        </div>
      );
    });

  return (
    <>
      { isAdmin &&  <form action={deletePlayerDispatch}>
        <RedSpinnerButton text="מחק שחקן"  />
      </form>}
      <form action={dispatch}>
        <div className="rtl rounded-md bg-gray-50 p-4 md:p-6">
          {/* player name */}
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              שם השחקן
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  defaultValue={player.name}
                  placeholder="הכנס שם"
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

          {/* player notes */}
          <div className="mb-4">
            <label htmlFor="notes" className="mb-2 block text-sm font-medium">
              הערות
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="notes"
                  name="notes"
                  defaultValue={player.notes}
                  placeholder="הערות"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="notes-error"
                />
              </div>
              <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              <div id="notes-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.notes &&
                  state?.errors.notes.map((error: string) => (
                    <div className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        {/* player image url */}
        <div className="rtl mb-4">
          <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
            כתובת תמונה
          </label>
          <div className="relative">
            <input
              id="image_url"
              name="image_url"
              type="text"
              value={imageUrl}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="image_url-error"
            />
          </div>
          {imageUrl && (
            <Image
              src={imageUrl}
              className="zoom-on-hover mr-2"
              width={60}
              height={60}
              alt={`profile picture`}
            />
          )}
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href={`/${userId}/current_tournament`}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            ביטול
          </Link>
          <SpinnerButton text="עדכן שחקן" />
        </div>
      </form>
      <div
        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        style={{ width: '130px' }}
      >
        <CldUploadWidget
          signatureEndpoint="/api/sign-image"
          options={{ sources: ['local', 'url', 'camera'] }}
          onUpload={(response) => {
            // @ts-ignore
            const url = response?.info?.url;
            setImageUrl(url);
          }}
        >
          {({ open }) => {
            return (
              <button
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
          <div className="rtl" style={{ textAlign: 'right' }}>
            <u>אישורי הגעה לשבוע הקרוב</u>
          </div>
          <div>{rsvpsForTheNextWeek}</div>
        </div>
      )}
    </>
  );
}
