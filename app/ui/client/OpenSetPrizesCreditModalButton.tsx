'use client';

import { PlayerDB } from '@/app/lib/definitions';
import React, { useState } from 'react';
import { setPrizesCreditWorth } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { usePathname, useSearchParams } from 'next/navigation';
import SpinnerButton from '@/app/ui/client/SpinnerButton';

function SetPrizesCreditForm({
  players,
  date,
  hide,
  prevPage,
  tournamentId,
  tournamentName,
}: {
  date: string;
  players: PlayerDB[];
  hide?: () => void;
  prevPage: string;
  tournamentId: string;
  tournamentName: string;
}) {
  const initialState = { message: null, errors: {} };

  const setPrizesCreditWorthWithDate = setPrizesCreditWorth.bind(null, {
    date,
    prevPage,
    tournamentId,
  });
  // @ts-ignore
  const [_state, dispatch] = useFormState(
    // @ts-ignore
    setPrizesCreditWorthWithDate,
    initialState,
  );

  const positions = players.sort((a, b) => a.position - b.position);
  const [balances, setBalances] = useState([
    0,
    ...positions.map((p) => p.creditWorth),
  ]);
  return (
    <div
      className="edit-player-modal-inner-div rtl align-text-right"
    >
      <form action={dispatch} className="form-control">
        <label
          className="mb-2 block  font-medium"
          style={{ marginBottom: 5 }}
        >
          <div> הגדר שווי פרסים בקרדיט </div>
          <div>{tournamentName}</div>
          <div> {date}</div>
        </label>
        <div>
          {positions.map((player) => {
            return (
              <div key={player.id} style={{ marginTop: 6, marginBottom: 2 }}>
                מקום #{player.position}
                <input
                  id={`#${player.position}`}
                  name={`#${player.position}`}
                  type="number"
                  step="1"
                  value={
                    balances[player.position] >= 0
                      ? balances[player.position]
                      : 0
                  }
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    if (newValue < 0) {
                      return;
                    }
                    const newBalances = [...balances];
                    newBalances[player.position] = newValue;
                    setBalances(newBalances);
                  }}
                  placeholder={`  שווי קרדיט של מקום #${player.position}  `}
                  className="peer block w-full rounded-md border  py-2 pl-10  outline-2 prizes-edit-input"
                />
              </div>
            );
          })}
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

export default function OpenSetPrizesCreditModalButton({
  date,
  tournamentId,
  tournamentName,
  players,
}: {
  date: string;
  tournamentId: string;
  tournamentName: string;
  players: PlayerDB[];
}) {
  const [show, setShow] = React.useState(false);
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;

  const close = () => {
    setShow(false);
  };
  return (
    <div
      className="give-credit-modal-button"
      style={{ marginRight: 10, marginTop: 30 }}
    >
      <div
        onClick={() => {
          setShow(true);
        }}
        className="pointer link-color"
        style={{ justifyContent: 'center', marginLeft: 30 }}
      >
        <u> הגדר שווי קרדיט </u>
      </div>

      <div className={show ? 'edit-player-modal' : 'hidden'}>
        <SetPrizesCreditForm
          date={date}
          players={players}
          hide={close}
          prevPage={prevPage}
          tournamentId={tournamentId}
          tournamentName={tournamentName}
        />
      </div>
    </div>
  );
}
