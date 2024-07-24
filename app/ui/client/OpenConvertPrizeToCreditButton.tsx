'use client';

import React, { useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { convertPrizeToCredit } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import Button from '@/app/ui/client/Button';
import SearchablePrizesDropdown from '@/app/ui/client/SearchablePrizesDropdown';
import {  PrizeInfoDB } from '@/app/lib/definitions';
import SpinnerButton from '@/app/ui/client/SpinnerButton';
import {CreditCardIcon} from "@heroicons/react/24/outline";

function OpenConvertPrizeToCreditForm({
  userId,
  prizeId,
  prizeName,
  hide,
  prevPage,
  prizesInformation,
}: {
  userId?: string;
  prizeId: string;
  prizeName: string;
  hide?: () => void;
  prevPage: string;
  prizesInformation: PrizeInfoDB[];
}) {
  const initialState = { message: null, errors: {} };
  const prizeInfo = prizesInformation.find((prize) => prize.name === prizeName);
  const data = { prizeId, prevPage, userId: userId! };
  const convertPrizeToCreditWithData = convertPrizeToCredit.bind(null, data);
  const [selectedPrize, setSelectedPrize] = useState<PrizeInfoDB | undefined>(
    prizeInfo,
  );

  // @ts-ignore
  const [_state, dispatch] = useFormState(
    // @ts-ignore
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
              <SearchablePrizesDropdown
                showPrizeName={false}
                prizes={prizesInformation}
                selectedVal={selectedPrize}
                handleChange={(val: any) => setSelectedPrize(val)}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <SpinnerButton text="Update" onClick={() => hide?.()} />
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
  prizesInformation,
}: {
  prizeId: string;
  prizeName: string;
  userId?: string;
  prizesInformation: PrizeInfoDB[];
}) {
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;
  const [show, setShow] = React.useState(false);

  const close = () => {
    setShow(false);
  };
  return (
      <div className="give-credit-modal-button" style={{marginRight: 10}}>
        <button
            className="pointer rounded-md border p-2 hover:bg-gray-100"
            onClick={() => {
              setShow(true);
            }}
        >
          <span className="sr-only">Convert to Credit</span>
          <CreditCardIcon className="w-6" title="Convert to Credit"/>
        </button>


        <div className={show ? 'edit-player-modal' : 'hidden'}>
          <OpenConvertPrizeToCreditForm
              hide={close}
              prevPage={prevPage}
              prizeId={prizeId}
              prizeName={prizeName}
              userId={userId}
              prizesInformation={prizesInformation}
          />
        </div>
      </div>
  );
}
