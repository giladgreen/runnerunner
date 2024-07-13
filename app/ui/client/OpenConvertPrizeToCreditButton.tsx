'use client';

import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { convertPrizeToCredit } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import Button from '@/app/ui/client/Button';

function OpenConvertPrizeToCreditForm({
  userId,
  prizeId,
  prizeName,
  hide,
  prevPage,
}: {
  userId?: string;
  prizeId: string;
  prizeName: string;
  hide?: () => void;
  prevPage: string;
}) {
  const initialState = { message: null, errors: {} };

  const data = { prizeId, prevPage, userId: userId! };
  const convertPrizeToCreditWithData = convertPrizeToCredit.bind(null, data);
  // @ts-ignore
  const [_state, dispatch] = useFormState(
    convertPrizeToCreditWithData,
    initialState,
  );

  return (
    <div className="edit-player-modal-inner-div">
      <form action={dispatch} className="form-control">
        <label className="mb-2 block text-sm font-medium">
          Convert Prize into credit
        </label>
        <div className="form-inner-control  rounded-md p-4 md:p-6">
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-medium"
              style={{ textAlign: 'left', marginTop: 30 }}
            >
              Prize: {prizeName}
            </label>
          </div>
          <div className="give_user_credit_amount mb-4">
            <label
              htmlFor="amount"
              className="mb-2 block text-sm font-medium"
              style={{ textAlign: 'left', marginTop: 30 }}
            >
              Credit amount
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="Enter credit amount"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="prize-error"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Button type="submit" onClick={() => hide?.()}>
            Update
          </Button>
        </div>
      </form>
      {hide && (
        <Button onClick={hide} style={{ marginTop: -52, marginLeft: 20 }}>
          Cancel
        </Button>
      )}
    </div>
  );
}

export default function OpenConvertPrizeToCreditButton({
  prizeId,
  prizeName,
  userId,
}: {
  prizeId: string;
  prizeName: string;
  userId?: string;
}) {
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;
  const [show, setShow] = React.useState(false);

  const close = () => {
    setShow(false);
  };
  return (
    <div className="give-credit-modal-button" style={{ marginRight: 10 }}>
      <div
        onClick={() => {
          setShow(true);
        }}
        className="pointer"
        style={{ fontSize: '24' }}
      >
        <button className="my-button">convert to credit</button>
      </div>
      <div className={show ? 'edit-player-modal' : 'hidden'}>
        <OpenConvertPrizeToCreditForm
          hide={close}
          prevPage={prevPage}
          prizeId={prizeId}
          prizeName={prizeName}
          userId={userId}
        />
      </div>
    </div>
  );
}
