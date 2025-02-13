'use client';

import React, { useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { convertPrizeToCredit } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import SearchablePrizesDropdown from '@/app/ui/client/SearchablePrizesDropdown';
import { PrizeInfoDB } from '@/app/lib/definitions';
import SpinnerButton from '@/app/ui/client/SpinnerButton';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'flowbite-react';

function OpenConvertPrizeToCreditForm({
  userId,
  prizeId,
  prizeName,
  hide,
  prevPage,
  prizesInformation,
  tournamentId,
}: {
  userId?: string;
  prizeId: string;
  prizeName: string;
  hide?: () => void;
  prevPage: string;
  tournamentId: string | null;
  prizesInformation: PrizeInfoDB[];
}) {
  const initialState = { message: null, errors: {} };
  const prizeInfo = prizesInformation.find((prize) => prize.name === prizeName);
  const data = { prizeId, prevPage, userId: userId!, tournamentId };
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
    <div className="OpenConvertPrizeToCreditForm">
      <form action={dispatch} className="form-control">
        <label className="mb-2 block  font-medium">
          המרת פרס לקרדיט
        </label>
        <div className="form-inner-control  rounded-md p-4 md:p-6">
          <div className="mb-4">
            <label
              className="mb-2 block  font-medium"
              style={{ textAlign: 'right', marginTop: 30 }}
            >
              פרס: {prizeName}
            </label>
          </div>
          <div className="give_user_credit_amount mb-4">
            <label
              htmlFor="amount"
              className="mb-2 block  font-medium"
              style={{ textAlign: 'right', marginTop: 30 }}
            >
              שווי קרדיט
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
          <SpinnerButton text="עדכון" onClick={() => hide?.()} />
        </div>
      </form>
      {hide && (
        <button className="my-button-cancel flex h-10 items-center rounded-lg  px-4  font-medium" onClick={hide} style={{ marginTop: -52, marginRight: 20 }}>
          ביטול
        </button>
      )}
    </div>
  );
}

export default function OpenConvertPrizeToCreditButton({
  prizeId,
  prizeName,
  userId,
  prizesInformation,
  tournamentId,
}: {
  prizeId: string;
  prizeName: string;
  userId?: string;
  tournamentId: string | null;
  prizesInformation: PrizeInfoDB[];
}) {
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;
  const [show, setShow] = React.useState(false);

  const close = () => {
    setShow(false);
  };
  const button = <button
    className="pointer move-up-down-button rounded-md border p-2 "
    onClick={() => {
      setShow(true);
    }}
  >
    <Tooltip content="המר לקרדיט" color="primary">
      <CreditCardIcon className="w-6" title="המר לקרדיט" />
    </Tooltip>
  </button>

  if (show){
    return (
      <div
        className="give-credit-modal-button "
        style={{ marginRight: 5, marginLeft: 10 }}
      >
        {button}

        <div className="OpenConvertPrizeToCreditFormWrapper">
          <OpenConvertPrizeToCreditForm
            hide={close}
            prevPage={prevPage}
            prizeId={prizeId}
            prizeName={prizeName}
            userId={userId}
            prizesInformation={prizesInformation}
            tournamentId={tournamentId}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="give-credit-modal-button"
      style={{ marginRight: 5, marginLeft: 10 }}
    >
      {button}
    </div>
  );
}
