'use client';
import React from 'react';
import { updatePrizeInfo } from '@/app/lib/actions';
import { PrizeInfoDB } from '@/app/lib/definitions';
import Link from 'next/link';
import Button from '@/app/ui/client/Button';
import { useFormState } from 'react-dom';
import { PencilIcon } from '@heroicons/react/24/outline';

export default function EditPrizeInfoForm({
  prize,
  prevPage,
}: {
  prize: PrizeInfoDB;
  prevPage: string;
}) {
  const initialState = { message: null, errors: {} };
  const updatePrizeInfoWithId = updatePrizeInfo.bind(null, {
    prizeId: prize.id,
    prevPage,
  });

  // @ts-ignore
  const [state, dispatch] = useFormState(
    // @ts-ignore
    updatePrizeInfoWithId,
    initialState,
  );

  return (
    <>
      <form action={dispatch}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* prize name */}
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Name
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  defaultValue={prize.name}
                  placeholder="Enter Prize Name"
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

          {/* prize extra */}
          <div className="mb-4">
            <label htmlFor="extra" className="mb-2 block text-sm font-medium">
              Extra
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="extra"
                  name="extra"
                  defaultValue={prize.extra}
                  placeholder="extra data"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="extra-error"
                />
              </div>
              <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              <div id="extra-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.extra &&
                  state?.errors.extra.map((error: string) => (
                    <div className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* prize credit */}
          <div className="mb-4">
            <label htmlFor="credit" className="mb-2 block text-sm font-medium">
              Credit worth
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="credit"
                  name="credit"
                  type="number"
                  defaultValue={prize.credit}
                  placeholder="Credit worth"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="extra-error"
                />
              </div>
              <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              <div id="credit-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.credit &&
                  state?.errors.credit.map((error: string) => (
                    <div className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Link
            href={prevPage}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit">Update prize</Button>
        </div>
      </form>
    </>
  );
}
