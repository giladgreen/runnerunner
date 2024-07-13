'use client';

import { PlayerDB } from '@/app/lib/definitions';
import React, { useState } from 'react';

import { setPrizesCreditWorth } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import Button from '@/app/ui/client/Button';
import { usePathname, useSearchParams } from 'next/navigation';

function SetPrizesCreditForm({
  players,
  date,
  hide,
  prevPage,
}: {
  date: string;
  players: PlayerDB[];
  hide?: () => void;
  prevPage: string;
}) {
  const initialState = { message: null, errors: {} };

  const setPrizesCreditWorthWithDate = setPrizesCreditWorth.bind(null, {
    date,
    prevPage,
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
    <div className="edit-player-modal-inner-div">
      <form action={dispatch} className="form-control">
        <label className="mb-2 block text-sm font-medium">
          Set prizes credit worth - {date}
        </label>
        <div>
          {positions.map((player) => {
            return (
              <div key={player.id}>
                #{player.position}
                <input
                  id={`#${player.position}`}
                  name={`#${player.position}`}
                  type="number"
                  step="1"
                  value={balances[player.position]}
                  onChange={(e) => {
                    const newBalances = [...balances];
                    newBalances[player.position] = Number(e.target.value);
                    setBalances(newBalances);
                  }}
                  placeholder={`enter #${player.position} place credit worth`}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            );
          })}
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

export default function OpenSetPrizesCreditModalButton({
  date,
  players,
}: {
  date: string;
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
      {
        <div
          onClick={() => {
            setShow(true);
          }}
          className="pointer"
          style={{ fontSize: '24' }}
        >
          <u> 💳 Set Prizes Credit Worth 💳</u>
        </div>
      }
      {
        <div className={show ? 'edit-player-modal' : 'hidden'}>
          <SetPrizesCreditForm
            date={date}
            players={players}
            hide={close}
            prevPage={prevPage}
          />
        </div>
      }
    </div>
  );
}
