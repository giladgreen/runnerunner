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
import { CreditCardIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/app/lib/utils';
import { Checkbox } from 'primereact/checkbox';
import { Tooltip } from 'flowbite-react';

function SetGivePrizeForm({
  player,
  hide,
  prevPage,
  stringDate,
  userId,
  prizesInformation,
  tournamentId,
  prizesEnabled,
}: {
  prizesEnabled: boolean;
  stringDate?: string;
  player: PlayerDB;
  hide?: () => void;
  prevPage: string;
  userId?: string;
  tournamentId: string | null;
  prizesInformation: PrizeInfoDB[];
}) {
  const initialState = { message: null, errors: {} };
  const legalNumber =
    !isNaN(Number(player.creditWorth)) && Number(player.creditWorth) >= 0;
  const [creditWorth, setCreditWorth] = useState(
    legalNumber ? player.creditWorth : 0,
  );

  let initialPrize = undefined;
  if (prizesInformation.length === 1) {
    initialPrize = prizesInformation[0];
  }
  if (prizesInformation.length > 1) {
    prizesInformation.sort((a, b) => b.credit - a.credit);
    initialPrize = prizesInformation.find(
      (prize) => prize.credit <= creditWorth,
    );
  }

  const [selectedPrize, setSelectedPrize] = useState<PrizeInfoDB | undefined>(
    initialPrize,
  );

  const [type, setType] = useState('credit');
  const diff = selectedPrize
    ? Math.abs(selectedPrize?.credit - creditWorth)
    : 0;

  const prizeWorthMoreWarning =
    selectedPrize && selectedPrize?.credit > creditWorth ? (
      <div className="error-message-color" style={{ marginLeft: 6, marginTop: 7 }}>
        {' '}
        * שווי הפרס גבוה משווי הקרדיט ב {formatCurrency(diff)}{' '}
      </div>
    ) : null;
  const creditWorthMoreWarning =
    selectedPrize && selectedPrize?.credit < creditWorth ? (
      <div className="error-message-color" style={{  marginLeft: 6, marginTop: 7 }}>
        {' '}
        * שווי הקרדיט גבוהה משווי הפרס ב {formatCurrency(diff)}{' '}
      </div>
    ) : null;

  const [updatePlayerCredit, setUpdatePlayerCredit] = useState(false);
  const setPlayerPrizeWithPlayerId = givePlayerPrizeOrCredit.bind(null, {
    userId: userId!,
    playerId: player.id,
    prevPage,
    stringDate,
    tournamentId,
  });

  // @ts-ignore
  const [_state, dispatch] = useFormState(
    // @ts-ignore
    setPlayerPrizeWithPlayerId,
    initialState,
  );

  return (
    <div className="edit-player-modal-inner-div">
      <form action={dispatch} className="form-control">
        {prizesEnabled ? (
          <label
            className="mb-2 block text-sm font-medium align-text-right"

          >
            תן פרס/קרדיט לשחקן
          </label>
        ) : (
          <label
            className="mb-2 block text-sm font-medium align-text-right"

          >
            תן קרדיט לשחקן
          </label>
        )}

        <div className="form-inner-control rounded-md p-4 md:p-6">
          <div className="relative mt-2 rounded-md">
            <div className="rsvp-section relative">
              <div className="justify-content-center radio flex flex-wrap gap-3">
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

                  <label
                    htmlFor="credit"
                    className="ml-2"
                    style={{ margin: '0 5px' }}
                  >
                    <b>קרדיט</b>
                  </label>
                </div>
                {prizesEnabled && (
                  <div
                    className="align-items-center flex"
                    style={{ marginLeft: 40 }}
                  >
                    <input
                      type="radio"
                      value="prize"
                      name="type"
                      checked={type === 'prize'}
                      onChange={() => setType('prize')}
                    />
                    <label
                      htmlFor="prize"
                      className="ml-2 "
                      style={{ margin: '0 5px' }}
                    >
                      <b>פרס</b>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* prize */}
          {type === 'prize' && (
            <div
              className="give_user_prize rtl mb-4"
              style={{ textAlign: 'right', marginTop: 11 }}
            >
              {selectedPrize && (
                <div className="flex">
                  <div style={{ marginLeft: 6 }}> פרס שנבחר:</div>
                  <div className="bold" style={{ zoom: 1.2 }}>
                    <b>{selectedPrize?.name} </b>
                  </div>
                </div>
              )}
              {selectedPrize && (
                <div className="flex" style={{ marginTop: 7 }}>
                  <div style={{ marginLeft: 6 }}> שווי הפרס:</div>
                  <div>
                    <b> {formatCurrency(selectedPrize?.credit)} </b>{' '}
                  </div>
                </div>
              )}
              {prizeWorthMoreWarning}
              {creditWorthMoreWarning}
              {(prizeWorthMoreWarning || creditWorthMoreWarning) && (
                <div
                  className="update_player_credit flex"
                  style={{ marginTop: 7 }}
                >
                  <Checkbox
                    inputId="update_player_credit"
                    name="update_player_credit"
                    value="update_player_credit"
                    checked={updatePlayerCredit}
                    onChange={(e) => setUpdatePlayerCredit(!!e.checked)}
                  />
                  <label
                    className="mb-3 mt-1 block text-xs font-medium text-gray-900"
                    htmlFor="update_player_credit"
                    style={{ marginRight: 7 }}
                  >
                    עדכן קרדיט שחקן בהתאם
                  </label>
                </div>
              )}

              <div className="flex" style={{ marginTop: 20 }}>
                <div style={{ marginLeft: 6 }}> החלף פרס</div>
                <SearchablePrizesDropdown
                  showPrizeName
                  prizes={prizesInformation}
                  selectedVal={selectedPrize}
                  handleChange={(val: any) => setSelectedPrize(val)}
                />
                <input
                  id="prize_worth"
                  name="prize_worth"
                  type="hidden"
                  value={selectedPrize?.credit}
                />
                <input
                  id="credit_worth"
                  name="credit_worth"
                  type="hidden"
                  value={creditWorth}
                />
              </div>
            </div>
          )}
          {/*  amount  */}
          {type === 'credit' ? (
            <div className="give_user_credit_amount mb-4">
              <label
                htmlFor="credit"
                className="mb-2 block text-sm font-medium"
                style={{ textAlign: 'right', marginTop: 30 }}
              >
                סכום
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
                  className="mb-2 block text-sm font-medium error-message-color"
                  style={{ textAlign: 'right', color: 'red' }}
                >
                  * ערך חיובי בלבד
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
        <Button onClick={hide} style={{ marginTop: -52, marginRight: 20 }}>
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
  tournamentId,
  prizesEnabled,
}: {
  player: PlayerDB;
  hasReceived: boolean;
  prizesEnabled: boolean;
  stringDate?: string;
  userId?: string;
  tournamentId: string | null;
  prizesInformation: PrizeInfoDB[];
}) {
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;
  const [show, setShow] = React.useState(false);

  const close = () => {
    setShow(false);
  };
  return (
    <div className="give-credit-modal-button" style={{ marginRight: 2 }}>
      {hasReceived && <TickIcon size={20} />}
      {!hasReceived && (
        <button
          className="pointer give-credit-modal-button-b rounded-md border p-2 hover:bg-gray-100"
          onClick={() => {
            setShow(true);
          }}
        >
          <Tooltip content="המר לקרדיט" color="primary">
            <CreditCardIcon className="w-6" title="המר לקרדיט" />
          </Tooltip>
        </button>
      )}
      {!hasReceived && (
        <div className={show ? 'edit-player-modal' : 'hidden'}>
          <SetGivePrizeForm
            prizesEnabled={prizesEnabled}
            player={player}
            hide={close}
            prevPage={prevPage}
            stringDate={stringDate}
            userId={userId}
            prizesInformation={prizesInformation}
            tournamentId={tournamentId}
          />
        </div>
      )}
    </div>
  );
}
