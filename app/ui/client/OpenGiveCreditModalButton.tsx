'use client';

import { PlayerDB, PrizeInfoDB } from '@/app/lib/definitions';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { TickIcon } from '@/app/ui/icons';
import { givePlayerPrizeOrCredit } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import Button from '@/app/ui/client/Button';
import SearchablePrizesDropdown from '@/app/ui/client/SearchablePrizesDropdown';
import SpinnerButton from '@/app/ui/client/SpinnerButton';
import {CreditCardIcon} from "@heroicons/react/24/outline";

function SetGivePrizeForm({
  player,
  hide,
  prevPage,
  stringDate,
  userId,
  prizesInformation,
}: {
  stringDate?: string;
  player: PlayerDB;
  hide?: () => void;
  prevPage: string;
  userId?: string;
  prizesInformation: PrizeInfoDB[];
}) {
  const initialState = { message: null, errors: {} };
  const [selectedPrize, setSelectedPrize] = useState<PrizeInfoDB | undefined>(
    undefined,
  );
  const setPlayerPrizeWithPlayerId = givePlayerPrizeOrCredit.bind(null, {
    userId: userId!,
    playerId: player.id,
    prevPage,
    stringDate,
  });
  // @ts-ignore
  const [_state, dispatch] = useFormState(
    // @ts-ignore
    setPlayerPrizeWithPlayerId,
    initialState,
  );
  const [type, setType] = useState('prize');
  const legalNumber =
    !isNaN(Number(player.creditWorth)) && Number(player.creditWorth) >= 0;
  const [creditWorth, setCreditWorth] = useState(
    legalNumber ? player.creditWorth : 0,
  );

  return (
    <div className="edit-player-modal-inner-div">
      <form action={dispatch} className="form-control">
        <label className="mb-2 block text-sm font-medium">
          תן פרס/קרדיט לשחקן

        </label>
        <div className="form-inner-control  rounded-md p-4 md:p-6">
          <div className="relative mt-2 rounded-md">
            <div className="rsvp-section relative">
              <div className="justify-content-center radio flex flex-wrap gap-3">
                <div
                  className="align-items-center flex"
                  style={{ marginLeft: 20 }}
                >
                  <input
                    type="radio"
                    value="prize"
                    name="type"
                    checked={type === 'prize'}
                    onChange={() => setType('prize')}
                  />
                  <label htmlFor="prize" className="ml-2 ">
                    <b>פרס</b>
                  </label>
                </div>
                <div
                  className="align-items-center flex"
                  style={{ marginLeft: 40 }}
                >
                  <input
                    type="radio"
                    value="credit"
                    name="type"
                    checked={type === 'credit'}
                    onChange={() => setType('credit')}
                  />

                  <label htmlFor="credit" className="ml-2">
                    <b>קרדיט</b>
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* prize */}
          {type === 'prize' ? (
            <div className="give_user_prize mb-4">
              <SearchablePrizesDropdown
                showPrizeName
                prizes={prizesInformation}
                selectedVal={selectedPrize}
                handleChange={(val: any) => setSelectedPrize(val)}
              />
            </div>
          ) : (
            <div className="mb-4"></div>
          )}
          {/*  amount  */}
          {type === 'credit' ? (
            <div className="give_user_credit_amount mb-4">
              <label
                htmlFor="credit"
                className="mb-2 block text-sm font-medium"
                style={{ textAlign: 'left', marginTop: 30 }}
              >
                Amount
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="credit"
                    name="credit"
                    type="number"
                    value={creditWorth}
                    onChange={(e) => setCreditWorth(Number(e.target.value))}
                    placeholder="סכום "
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    aria-describedby="prize-error"
                  />
                </div>
              </div>

              {creditWorth < 1 && (
                <span
                  className="mb-2 block text-sm font-medium"
                  style={{ textAlign: 'left', color: 'red' }}
                >
                  * not legal
                </span>
              )}
            </div>
          ) : (
            <div className="mb-4"></div>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <SpinnerButton text="עדכון" onClick={() => hide?.()} />
        </div>
      </form>
      {hide && (
        <Button onClick={hide} style={{ marginTop: -52, marginLeft: 20 }}>
          ביטול
        </Button>
      )}
    </div>
  );
}

export default function OpenGiveCreditModalButton({
  player,
  hasReceived,
  stringDate,
  userId,
  prizesInformation,
}: {
  player: PlayerDB;
  hasReceived: boolean;
  stringDate?: string;
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
        {hasReceived && <TickIcon size={20}/>}
        {!hasReceived && (
            <button
                className="pointer rounded-md border p-2 hover:bg-gray-100"
                onClick={() => {
                  setShow(true);
                }}
            >
              <span className="sr-only">Convert to Credit</span>
              <CreditCardIcon className="w-6" title="המר לקרדיט"/>
            </button>

  )
}
{
  !hasReceived && (
      <div className={show ? 'edit-player-modal' : 'hidden'}>
        <SetGivePrizeForm
            player={player}
            hide={close}
            prevPage={prevPage}
            stringDate={stringDate}
            userId={userId}
            prizesInformation={prizesInformation}
          />
        </div>
      )}
    </div>
  );
}
