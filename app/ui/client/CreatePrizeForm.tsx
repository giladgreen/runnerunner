'use client';
import React from 'react';
import Link from 'next/link';
import { PencilIcon } from '@heroicons/react/24/outline';
import {
createPrizeInfo
} from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import SpinnerButton from '@/app/ui/client/SpinnerButton';
import { PrizeInfoDB } from '@/app/lib/definitions';

export function CreatePrizeForm({
  prevPage,
  hide,
  prizes,
}: {
  prevPage: string;
  hide?: ()=>void;
  prizes?: PrizeInfoDB[];
}) {
  const initialState = { message: null, errors: {} };
  const createPrizeInfoWithPrevPage = createPrizeInfo.bind(null, {
    prevPage,
  });

  const [name,setName] = React.useState('');
  const [extra,setExtra] = React.useState('');
  const [credit,setCredit] = React.useState(0);

  // @ts-ignore
  const [state, dispatch] = useFormState(
    // @ts-ignore
    createPrizeInfoWithPrevPage,
    initialState,
  );

  return (
    <form action={dispatch} className={hide? 'CreatePrizeForm' : undefined}>
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
                value={name}
                onChange={(e)=>setName(e.target.value)}
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
                value={extra}
                onChange={(e)=>setExtra(e.target.value)}
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
                value={credit}
                onChange={(e)=>setCredit(Number(e.target.value))}
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
        {hide ? (  <div
          onClick={hide}
          className="my-button-cancel flex h-10 items-center rounded-lg  px-4 font-medium  transition-colors pointer"
        >
          ביטול
        </div>) : (  <Link
          href={prevPage}
          className="my-button-cancel flex h-10 items-center rounded-lg  px-4 font-medium  transition-colors pointer"
        >
          ביטול
        </Link>)}

        <SpinnerButton text="צור פרס" onClick={()=>{
          if (prizes){
            prizes.push({
              name,
              extra,
              credit,
            } as PrizeInfoDB);
          }
          if (hide){
            setTimeout(hide, 1000)
        }}} />
      </div>
    </form>
)
  ;
}
