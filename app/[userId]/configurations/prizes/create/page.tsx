'use client';
import React from 'react';
import { createPrizeInfo } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { PencilIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import SpinnerButton from '@/app/ui/client/SpinnerButton';
import Breadcrumbs from '@/app/ui/client/Breadcrumbs';

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
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: '.', href: `/${params.userId}` },
          {
            label: 'הגדרות',
            href: `/${params.userId}/configurations`,
          },
          {
            label: 'פרסים',
            href: `/${params.userId}/configurations/prizes`,
          },
          {
            label: 'יצירת פרס חדש',
            href: `/${params.userId}/configurations/prizes/create`,
            active: true,
          },
        ]}
      />

    <form action={dispatch}>
      <div
        className="rtl rounded-md p-4 md:p-6 align-text-right"
      >
        {/* prize name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block font-medium">
            שם
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                placeholder="הכנס שם פרס"
                className="peer block w-full rounded-md border  py-2 pl-10 outline-2 prizes-edit-input"
                aria-describedby="name-error"
              />
            </div>
            <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.name &&
                state?.errors.name.map((error: string) => (
                  <div className="mt-2 text-red-500" key={error}>
                    {error}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* prize extra */}
        <div className="mb-4">
          <label htmlFor="extra" className="mb-2 block font-medium">
            מידע נוסף
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="extra"
                name="extra"
                placeholder="מידע נוסף אם יש"
                className="peer block w-full rounded-md border  py-2 pl-10 outline-2 prizes-edit-input"
                aria-describedby="extra-error"
              />
            </div>
            <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
            <div id="extra-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.extra &&
                state?.errors.extra.map((error: string) => (
                  <div className="mt-2 text-red-500" key={error}>
                    {error}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* prize credit */}
        <div className="mb-4">
          <label htmlFor="credit" className="mb-2 block font-medium">
            שווי בקרדיט
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="credit"
                name="credit"
                type="number"
                placeholder="הכנס שווי בקרדיט"
                className="peer block w-full rounded-md border  py-2 pl-10 outline-2 prizes-edit-input"
                aria-describedby="extra-error"
              />
            </div>

            <div id="credit-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.credit &&
                state?.errors.credit.map((error: string) => (
                  <div className="mt-2 text-red-500" key={error}>
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
          className="my-button-cancel flex h-10 items-center rounded-lg  px-4 font-medium  transition-colors "
        >
          ביטול
        </Link>
        <SpinnerButton text="צור פרס" />
      </div>
    </form>
    </div>
  );
}
