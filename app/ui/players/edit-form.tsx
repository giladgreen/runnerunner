'use client';
import { updatePlayer } from '@/app/lib/actions';
import { Checkbox } from 'primereact/checkbox';
import { CldImage, CldUploadWidget } from 'next-cloudinary';

import {PlayerDB, PlayerForm, TournamentDB} from '@/app/lib/definitions';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import {useFormState} from "react-dom";
import {PencilIcon} from "@heroicons/react/24/outline";
import {useState} from "react";
import RSVPButton from "@/app/ui/players/rsvp-button";

const translation = {
    Sunday: 'יום ראשון',
    Monday: 'יום שני',
    Tuesday: 'יום שלישי',
    Wednesday: 'יום רביעי',
    Thursday: 'יום חמישי',
    Friday: 'יום שישי',
    Saturday: 'יום שבת',
}

export default function EditPlayerForm({
  player,
  tournaments,
  prevPage
}: {
  player: PlayerForm;
  tournaments: TournamentDB[];
  prevPage: string
}) {
    const initialState = { message: null, errors: {} };
    const updatePlayerWithId = updatePlayer.bind(null, {id: player.id, prevPage});
    const [imageUrl, setImageUrl] = useState(player.image_url ?? '');

    const [state, dispatch] = useFormState(updatePlayerWithId, initialState);


    const dayOfTheWeek = (new Date()).toLocaleString('en-us', { weekday: 'long' });
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days.indexOf(dayOfTheWeek);
    const rsvps = player.rsvps;

    const rsvpsForTheNextWeek = tournaments.slice(today).map((tournament, index) => {
        const date = (new Date((new Date()).getTime() + (1000 * 60 * 60 * 24 * index)));
        const dayOfTheWeek = date.toLocaleString('en-us', { weekday: 'long' });
        const stringDate = date.toISOString().slice(0,10);
        // @ts-ignore
        const text = ` ${translation[dayOfTheWeek]} - ${tournament.name}`;
        return <div key={tournament.id}>
            {tournament.rsvp_required ?
                (tournament.max_players === 0 ? '' : <RSVPButton player={player as PlayerDB} prevPage={`/dashboard/players/${player.id}/edit`} stringDate={stringDate} text={text}/>)
                : <div>◻️ {text} </div>}
        </div>

    });

    return (
      <>
          <form action={dispatch}>
              <div className="rounded-md bg-gray-50 p-4 md:p-6">
                  {/* player name */}
                  <div className="mb-4">
                      <label htmlFor="name" className="mb-2 block text-sm font-medium">
                          Name
                      </label>
                      <div className="relative mt-2 rounded-md">
                          <div className="relative">
                              <input
                                  id="name"
                                  name="name"
                                  defaultValue={player.name}
                                  placeholder="Enter Name"
                                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                  aria-describedby="name-error"
                              />
                          </div>
                          <PencilIcon
                              className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
                          <div id="name-error" aria-live="polite" aria-atomic="true">
                              {state.errors?.name &&
                                  state.errors.name.map((error: string) => (
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
                          Notes
                      </label>
                      <div className="relative mt-2 rounded-md">
                          <div className="relative">
                              <input
                                  id="notes"
                                  name="notes"
                                  defaultValue={player.notes}
                                  placeholder="Enter Notes"
                                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                  aria-describedby="notes-error"
                              />
                          </div>
                          <PencilIcon
                              className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
                          <div id="notes-error" aria-live="polite" aria-atomic="true">
                              {state.errors?.notes &&
                                  state.errors.notes.map((error: string) => (
                                      <div className="mt-2 text-sm text-red-500" key={error}>
                                          {error}
                                      </div>
                                  ))}
                          </div>
                      </div>
                  </div>
                    {/* player rsvp */}
                  <div className="mb-4">
                      <label htmlFor="notes" className="mb-2 block text-sm font-medium">
                          RSVP
                      </label>
                  </div>

              </div>
              {/* player image url */}
              <div className="mb-4">
                  <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
                      image_url
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
                  { imageUrl && <CldImage src={imageUrl} width={60} height={60} style={{ marginTop: 20}} alt=""/> }
              </div>
              <div className="mt-6 flex justify-end gap-4">
                  <Link
                      href="/dashboard/players"
                      className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                  >
                      Cancel
                  </Link>
                  <Button type="submit">Update player</Button>
              </div>
          </form>
          <div
              className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
              style={{width: '130px'}}
          >
              <CldUploadWidget signatureEndpoint="/api/sign-image"
                               options={{sources: ['local', 'url', 'camera']}}
                               onUpload={(response) => {

                                   // @ts-ignore
                                   const url = response?.info?.url;
                                   setImageUrl(url);
                               }}
              >
                  {
                      ({open}) => {
                          return <button onClick={() => {
                              open();
                          }}>Upload image</button>
                      }
                  }

              </CldUploadWidget>
          </div>
          <div style={{ marginTop: 45, border: '2px solid blue', borderRadius:5, padding:10}}>
             <div><u>RSVP</u></div>
             <div>
                 {rsvpsForTheNextWeek}
             </div>
          </div>
      </>
  );
}
