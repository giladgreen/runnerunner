'use client';
import React from 'react';
// @ts-ignore
import { Circle as SpinningChip } from 'react-awesome-spinners'
import { updatePrizeInfo } from '@/app/lib/actions';
import { PrizeInfoDB } from '@/app/lib/definitions';
import Link from 'next/link';
import Button from '@/app/ui/client/Button';
import { useFormState, useFormStatus } from 'react-dom';
import { PencilIcon } from '@heroicons/react/24/outline';
import DeletePrizeInfoButton from '@/app/ui/client/DeletePrizeInfoButton';

export default function EditPrizeInfoForm({
  userId,
  prize,
  prizes,
  prevPage,
  hide,
}: {
  prizes: PrizeInfoDB[];
  prize: PrizeInfoDB;
  prevPage: string;
  userId: string;
  hide?: ()=>void;
}) {

  const initialState = { message: null, errors: {} };
  const updatePrizeInfoWithId = updatePrizeInfo.bind(null, {
    prizeId: prize?.id,
    prevPage,
    userId,
  });

  const [name,setName] = React.useState(prize.name);
  const [extra,setExtra] = React.useState(prize.extra);
  const [credit,setCredit] = React.useState(prize.credit);

  // @ts-ignore
  const [state, dispatch] = useFormState(
    // @ts-ignore
    updatePrizeInfoWithId,
    initialState,
  );
  const { pending } = useFormStatus();
  if (!prize){
    return 'פרס לא נמצא';
  }

  return (
    <div className="rtl">
      <form action={dispatch} className={hide? 'EditPrizeInfoForm' : undefined}>
        <div  className="rtl  rounded-md  p-4 md:p-6">
          {/* prize name */}
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block  font-medium">
              שם
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative general-input">
                <input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  placeholder="הכנס פרס"
                  className="peer block w-full rounded-md border  py-2 pl-10  outline-2 "
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

          {/* prize extra */}
          <div className="mb-4">
            <label htmlFor="extra" className="mb-2 block  font-medium">
              עוד מידע
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative general-input">
                <input
                  id="extra"
                  name="extra"
                  value={extra}
                  onChange={(e)=>setExtra(e.target.value)}
                  placeholder="מידע נוסף"
                  className="peer block w-full rounded-md border  py-2 pl-10  outline-2 "
                  aria-describedby="extra-error"
                />
              </div>
              <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
              <div id="extra-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.extra &&
                  state?.errors.extra.map((error: string) => (
                    <div className="mt-2  text-red-500" key={error}>
                      {error}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* prize credit */}
          <div className="rtl mb-4">
            <label htmlFor="credit" className="mb-2 block  font-medium">
              שווי בקרדיט
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative general-input" style={{ color: 'var(--black)'}}>
                <input
                  id="credit"
                  name="credit"
                  type="number"
                  value={credit}
                  onChange={(e)=>setCredit(Number(e.target.value))}
                  placeholder="שווי קרדיט"
                  className="peer block w-full rounded-md border  py-2 pl-10  outline-2 "
                  aria-describedby="extra-error"
                />
              </div>
              <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
              <div id="credit-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.credit &&
                  state?.errors.credit.map((error: string) => (
                    <div className="mt-2  text-red-500" key={error}>
                      {error}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          {
            hide ? (  <div
              onClick={hide}
              className="my-button-cancel flex h-10 items-center rounded-lg  px-4  font-medium  transition-colors pointer"
            >
              ביטול
            </div>) : (  <Link
              href={prevPage}
              className="my-button-cancel flex h-10 items-center rounded-lg  px-4  font-medium  transition-colors pointer"
            >
              ביטול
            </Link>)
          }

          <Button type="submit"
                  onClick={()=>{
                    if (pending){
                      return;
                    }
                    if (prizes){
                      const prizeToUpdate = prizes.find(p=>p.id !== prize.id);
                      if (prizeToUpdate) {
                        prizeToUpdate.name = name;
                        prizeToUpdate.extra = extra;
                        prizeToUpdate.credit = credit;
                      }
                    }
                    if (hide){
                      setTimeout(hide, 500)
                    }}} >


            {pending ? <SpinningChip color="var(--white)"  size={20}/> : 'עדכון'}
          </Button>

        </div>
      </form>
      <div className="cellular" style={{ marginTop: -50, marginRight: 35 }}>
        <DeletePrizeInfoButton
          prize={prize}
          userId={userId}
          text={'מחיקת הגדרות פרס'}
        />
      </div>
    </div>
  );
}

