'use client';
import React from 'react';
import { createPrizeInfo } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { PencilIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import SpinnerButton from '@/app/ui/client/SpinnerButton';

export default function CreateNewPrizesInfoPage({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = params;
  const prevPage = `/${userId}/configurations/prizes`;
  const initialState = { message: null, errors: {} };
  const createPrizeInfoWithPrevPage = createPrizeInfo.bind(null, {
    prevPage,
  });

  // @ts-ignore
  const [state, dispatch] = useFormState(
    // @ts-ignore
    createPrizeInfoWithPrevPage,
    initialState,
  );

  return (
    <form action={dispatch}>
      <div
        className="rtl rounded-md bg-gray-50 p-4 md:p-6"
        style={{ textAlign: 'right' }}
      >
        {/* prize name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            שם
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                placeholder="הכנס שם פרס"
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
            מידע נוסף
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="extra"
                name="extra"
                placeholder="מידע נוסף אם יש"
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
            שווי בקרדיט
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="credit"
                name="credit"
                type="number"
                placeholder="הכנס שווי בקרדיט"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="extra-error"
              />
            </div>

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
          ביטול
        </Link>
        <SpinnerButton text="צור פרס" />
      </div>
    </form>
  );
}
