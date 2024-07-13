'use client';

import { PencilIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import Button from '@/app/ui/client/Button';
import { createPlayerUsageLog } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { PlayerDB, TournamentDB } from '@/app/lib/definitions';
import { useEffect, useState } from 'react';
import SearchablePlayersDropdown from '@/app/ui/client/SearchablePlayersDropdown';

export default function UseCreditForm({
  players,
  player,
  tournaments,
  hide,
  prevPage,
  userId,
}: {
  players: PlayerDB[];
  prevPage: string;
  player: PlayerDB;
  tournaments: TournamentDB[];
  hide?: () => void;
  userId: string;
}) {
  const initialState = { message: null, errors: {} };
  const createPlayerUsageLogWithPlayerData = createPlayerUsageLog.bind(null, {
    player,
    prevPage,
    userId,
  });
  const now = new Date();
  const dayOfTheWeek = now
    .toLocaleString('en-us', { weekday: 'long' })
    .toLowerCase();
  const tournament = tournaments.find(
    (t) => t.day.toLowerCase() === dayOfTheWeek,
  );
  // @ts-ignore
  const historyLog = player.historyLog || [];

  const isToday = (date: Date) => {
    return new Date().getTime() - date.getTime() < 12 * 60 * 60 * 1000;
  };
  const todayHistory = historyLog.filter((log) =>
    isToday(new Date(log.updated_at)),
  );
  const isRebuy = todayHistory.length > 0;
  const entryText = isRebuy ? 'כניסה נוספת' : 'כניסה';
  const initialNote = `${tournament!.name} - ${entryText}`;
  const initialAmount = isRebuy ? tournament!.re_buy : tournament!.buy_in;
  // @ts-ignore
  const [state1, dispatch] = useFormState(
    createPlayerUsageLogWithPlayerData,
    initialState,
  );
  const [amount, setAmount] = useState(initialAmount);
  const [note, setNote] = useState(initialNote);
  const [otherPlayer, setOtherPlayer] = useState<PlayerDB | undefined>(
    undefined,
  );

  const useCredit = amount < player.balance;
  const [type, setType] = useState(useCredit ? 'credit' : 'cash');

  useEffect(() => {
    if (amount !== initialAmount) {
      setAmount(initialAmount);
    }

    if (note !== initialNote) {
      setNote(initialNote);
    }
  }, [
    player,
    tournaments,
    amount,
    setAmount,
    initialAmount,
    note,
    setNote,
    initialNote,
  ]);
  return (
    <div className="edit-player-modal-inner-div">
      <form action={dispatch} className="form-control">
        <div className="form-inner-control  rounded-md p-4 md:p-6">
          {/*  balance change */}
          <div className="mb-4">
            <label htmlFor="change" className="mb-2 block text-sm font-medium">
              Amount
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="change"
                  name="change"
                  type="number"
                  step="10"
                  min={0}
                  placeholder="Enter ILS amount"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="change-error"
                  value={amount}
                  onChange={(e) => {
                    setAmount(Number(e.target.value));
                  }}
                />
                <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <div id="change-error" aria-live="polite" aria-atomic="true">
                {state1?.errors?.change &&
                  state1?.errors.change.map((error: string) => (
                    <div className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* note */}
          <div className="mb-4">
            <label htmlFor="note" className="mb-2 block text-sm font-medium">
              Note
            </label>
            <div className="relative">
              <input
                id="note"
                name="note"
                type="text"
                placeholder="Enter note"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="note-error"
                required
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                }}
              />

              <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="note-error" aria-live="polite" aria-atomic="true">
              {state1?.errors?.note &&
                state1?.errors.note.map((error: string) => (
                  <div className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </div>
                ))}
            </div>
          </div>

          {/* type */}
          <div className="relative mt-2 rounded-md">
            <div className="rsvp-section relative">
              <div className="justify-content-center radio flex flex-wrap gap-3">
                <div className="align-items-center flex">
                  <input
                    type="radio"
                    value="credit"
                    name="type"
                    checked={type === 'credit'}
                    onChange={() => setType('credit')}
                  />
                  <label htmlFor="credit" className="ml-2">
                    Credit
                  </label>
                </div>
                <div className="align-items-center flex">
                  <input
                    type="radio"
                    value="cash"
                    name="type"
                    checked={type === 'cash'}
                    onChange={() => setType('cash')}
                  />
                  <label htmlFor="cash" className="ml-2">
                    Cash
                  </label>
                </div>
                <div className="align-items-center flex">
                  <input
                    type="radio"
                    value="wire"
                    name="type"
                    checked={type === 'wire'}
                    onChange={() => setType('wire')}
                  />
                  <label htmlFor="wire" className="ml-2">
                    Money wire
                  </label>
                </div>
                <div className="align-items-center flex">
                  <input
                    type="radio"
                    value="credit_by_other"
                    name="type"
                    checked={type === 'credit_by_other'}
                    onChange={() => setType('credit_by_other')}
                  />
                  <label htmlFor="credit_by_other" className="ml-2">
                    Someone else Credit
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* other player */}
          {type === 'credit_by_other' && (
            <div className="mb-4">
              <label
                htmlFor="player"
                className="mb-2 block text-sm font-medium"
              >
                Player:
              </label>
              <div className="relative">
                <SearchablePlayersDropdown
                  playerId={player.id}
                  players={players.filter((p) => p.id !== player.id)}
                  selectedVal={otherPlayer}
                  handleChange={(val: any) => setOtherPlayer(val)}
                />
              </div>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Button type="submit" onClick={() => hide?.()}>
            {' '}
            {isRebuy ? 'Rebuy' : 'Buy In'}
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
