'use client';
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import Link from 'next/link';
import {
  PencilIcon,
  PhoneIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createPlayer } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import {useState} from "react";
import {usePathname, useSearchParams} from "next/navigation";

export default function CreatePlayerForm({prevPage}:{prevPage:string}) {
  const initialState = { message: null, errors: {} };

  const createPlayerWithPrevPage = createPlayer.bind(null, prevPage);
  // @ts-ignore
  const [state, dispatch] = useFormState(createPlayerWithPrevPage, initialState);
  const [balanceNote, setBalanceNote] = useState('new player');
  const [imageUrl, setImageUrl] = useState('');
  const [balance, setBalance] = useState(0);

  return (<>
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* player Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
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
            {state?.errors?.name &&
                state?.errors.name.map((error: string) => (
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
            {state?.errors?.phone_number &&
                state?.errors.phone_number.map((error: string) => (
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
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                  placeholder="Enter ILS balance"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="balance-error"

              />
              <BanknotesIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
            </div>
            <div id="balance-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.balance &&
                  state?.errors.balance.map((error: string) => (
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
                value={balanceNote}
                onChange={(e) => setBalanceNote(e.target.value)}
                placeholder="Enter note"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="note-error"

            />

            <PencilIcon
                className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
          </div>
          <div id="note-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.note &&
                state?.errors.note.map((error: string) => (
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
            {state?.errors?.notes &&
                state?.errors.notes.map((error: string) => (
                    <div className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </div>
                ))}
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

      </CldUploadWidget></div>
    </>

    );
    }
