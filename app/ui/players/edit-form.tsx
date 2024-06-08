'use client';
import { updatePlayer } from '@/app/lib/actions';
import { Checkbox } from 'primereact/checkbox';
import { CldImage, CldUploadWidget } from 'next-cloudinary';

import { PlayerForm } from '@/app/lib/definitions';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import {useFormState} from "react-dom";
import {PencilIcon} from "@heroicons/react/24/outline";
import {useState} from "react";

export default function EditPlayerForm({
  player,
  redirectAddress
}: {
  player: PlayerForm;
  redirectAddress: string
}) {
  const initialState = { message: null, errors: {} };
  const updatePlayerWithId = updatePlayer.bind(null, {id: player.id, redirectAddress});
    const [imageUrl, setImageUrl] = useState(player.image_url ?? '');

    const [state, dispatch] = useFormState(updatePlayerWithId, initialState);
  const [sundayChecked, setSundayChecked] = useState(!!player.sunday_rsvp);
    const [mondayChecked, setMondayChecked] = useState(!!player.monday_rsvp);
    const [tuesdayChecked, setTuesdayChecked] = useState(!!player.tuesday_rsvp);
    const [wednesdayChecked, setWednesdayChecked] = useState(!!player.wednesday_rsvp);
    const [thursdayChecked, setThursdayChecked] = useState(!!player.thursday_rsvp);
    const [saturdayChecked, setSaturdayChecked] = useState(!!player.saturday_rsvp);
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
      </>
  );
}
