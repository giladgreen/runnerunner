'use client';

import { PencilIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import Button from '@/app/ui/client/Button';
import { createPlayerUsageLog } from '@/app/lib/actions';
import { useFormState, useFormStatus } from 'react-dom';
import { PlayerDB, TournamentDB } from '@/app/lib/definitions';
import { useEffect, useState } from 'react';
import SearchablePlayersDropdown from '@/app/ui/client/SearchablePlayersDropdown';
import Spinner from '@/app/ui/client/Spinner';
import { getCurrentDate } from '@/app/lib/clientDateUtils';
import { Switch } from '@nextui-org/react';

export default function UseCreditForm({
  players,
  player,
  tournaments,
  hide,
  prevPage,
  userId,
  setQuery,
  tournamentId,
}: {
  players: PlayerDB[];
  tournamentId: string | null;
  prevPage: string;
  player: PlayerDB;
  tournaments: TournamentDB[];
  hide?: () => void;
  userId: string;
  setQuery: (val: string) => void;
}) {
  const initialState = { message: null, errors: {} };
  const createPlayerUsageLogWithPlayerData = createPlayerUsageLog.bind(null, {
    player,
    prevPage,
    userId,
    tournamentId,
  });

  const tournament = tournaments.find((t) => t.id === tournamentId);
  // @ts-ignore
  const historyLog = player.historyLog || [];

  const isToday = (date: Date) => {
    return getCurrentDate().getTime() - date.getTime() < 12 * 60 * 60 * 1000;
  };
  const todayHistory = historyLog.filter((log) =>
    isToday(getCurrentDate(log.updated_at)),
  );
  const isRebuy = todayHistory.length > 0;
  const entryText = isRebuy ? 'כניסה נוספת' : 'כניסה';
  const maxRebuyReached = todayHistory.length >= 3;
  const initialNote = `${tournament!.name} - ${entryText}`;
  const initialAmount = isRebuy ? tournament!.re_buy : tournament!.buy_in;
  // @ts-ignore
  const [state1, dispatch] = useFormState(
    // @ts-ignore
    createPlayerUsageLogWithPlayerData,
    initialState,
  );

  const [amount, setAmount] = useState(initialAmount);
  const [amount2, setAmount2] = useState(0);
  const [note, setNote] = useState(initialNote);
  const [note2, setNote2] = useState('שחקן פיצל כניסה');
  const [otherPlayer, setOtherPlayer] = useState<PlayerDB | undefined>(
    undefined,
  );

  const useCredit = amount < player.balance;
  const [wasTrue, setWasTrue] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isSplit, setIsSplit] = useState(false);
  const [type, setType] = useState(useCredit ? 'credit' : 'cash');
  const [type2, setType2] = useState('cash');

  useEffect(() => {
    if (amount !== initialAmount) {
      setAmount(initialAmount);
    }

    if (note !== initialNote) {
      setNote(initialNote);
    }
  }, [player, tournaments, setAmount, initialAmount, setNote, initialNote]);

  function SubmitButton() {
    const { pending } = useFormStatus();

    useEffect(() => {
      if (pending) {
        setWasTrue(true);
      }
      setIsPending(pending);

    }, [pending]);

    useEffect(() => {
      if (wasTrue && !isPending) {
        console.log('## calling hide');
        hide?.();
        setQuery('');
      }
    }, [isPending, wasTrue]);

    if (pending) {
      return <Spinner size={40} style={{ marginRight: 30 }} />;
    }
    return (
      <Button
        type="submit"
        disabled={pending}
        className={pending ? ' gray-on-hover bg-gray-500' : ''}
      >
        {isRebuy ? 'כניסה נוספת' : 'כניסה'}
      </Button>
    );
  }

  function CancelButton() {
    if (isPending) {
      return null;
    }

    return (
      <Button onClick={hide} style={{ marginTop: -52, marginRight: 20 }}>
        ביטול
      </Button>
    );
  }

  return (
    <div
      className="edit-player-modal-inner-div rtl"
      style={{ textAlign: 'right' }}
    >
      <form action={dispatch} className="form-control">
        <div className="form-inner-control  rounded-md p-4 md:p-6">
          {/*  balance change */}
          <div className="mb-4">
            <label htmlFor="change" className="mb-2 block text-sm font-medium">
              סכום
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="change"
                  name="change"
                  type="number"
                  step="1"
                  min={1}
                  placeholder="סכום"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="change-error"
                  value={amount}
                  onChange={(e) => {
                    console.log(
                      'calling setAmount with',
                      Number(e.target.value),
                    );
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
              סיבה
            </label>
            <div className="relative">
              <input
                id="note"
                name="note"
                type="text"
                placeholder="הערה"
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
          <div className="rtl relative mt-2 rounded-md">
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
                    קרדיט
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
                    מזומן
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
                    העברה
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
                    קרדיט על חשבון שחקן אחר
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
                style={{ margin: '7px 0 0 0' }}
              >
                שחקן:
              </label>
              <div className="relative">
                <SearchablePlayersDropdown
                  playerId={player.id}
                  players={players.filter(
                    (p) => p.id !== player.id && p.balance > 0,
                  )}
                  selectedVal={otherPlayer}
                  handleChange={(val: any) => setOtherPlayer(val)}
                />
              </div>
            </div>
          )}
        </div>
        {maxRebuyReached && (
          <div style={{ color: 'red' }}>
            * שים לב: השחקן ניצל כבר את כל הכניסות שלו
          </div>
        )}
        <div
          className="mt-6 flex justify-start gap-4"
          style={{ marginRight: 15 }}
        >
          <Switch
            isSelected={isSplit}
            onChange={() => {
              setIsSplit(!isSplit);
            }}
          />
          <div style={{ display: 'none', visibility: 'hidden' }}>
            <div>
              <input
                type="radio"
                value="true"
                name="split"
                checked={isSplit}
                readOnly
              />
              <input
                type="radio"
                value="false"
                name="split"
                checked={!isSplit}
                readOnly
              />
            </div>
          </div>
        </div>
        <div style={{ marginTop: 3 }}>פיצול הכניסה</div>
        <div
          className="form-inner-control  rounded-md p-4 md:p-6"
          style={{
            display: isSplit ? undefined : 'none',
            visibility: isSplit ? undefined : 'hidden',
          }}
        >
          {/*  balance change 2 */}
          <div className="mb-4">
            <label htmlFor="change2" className="mb-2 block text-sm font-medium">
              סכום שני
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="change2"
                  name="change2"
                  type="number"
                  step="1"
                  min={0}
                  placeholder="סכום"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="change2-error"
                  value={amount2}
                  onChange={(e) => {
                    console.log(
                      'calling setAmount2 with',
                      Number(e.target.value),
                    );
                    setAmount2(Number(e.target.value));
                  }}
                />
                <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <div id="change2-error" aria-live="polite" aria-atomic="true">
                {state1?.errors?.change2 &&
                  state1?.errors.change2.map((error: string) => (
                    <div className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* note 2 */}
          <div className="mb-4">
            <label htmlFor="note2" className="mb-2 block text-sm font-medium">
              סיבה
            </label>
            <div className="relative">
              <input
                id="note2"
                name="note2"
                type="text"
                placeholder="הערה"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="note-error"
                required
                value={note2}
                onChange={(e) => {
                  setNote2(e.target.value);
                }}
              />

              <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="note2-error" aria-live="polite" aria-atomic="true">
              {state1?.errors?.note2 &&
                state1?.errors.note2.map((error: string) => (
                  <div className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </div>
                ))}
            </div>
          </div>

          {/* type 2 */}
          <div className="rtl relative mt-2 rounded-md">
            <div className="rsvp-section relative">
              <div className="justify-content-center radio flex flex-wrap gap-3">
                <div className="align-items-center flex">
                  <input
                    type="radio"
                    value="cash"
                    name="type2"
                    checked={type2 === 'cash'}
                    onChange={() => setType2('cash')}
                  />
                  <label htmlFor="cash" className="ml-2">
                    מזומן
                  </label>
                </div>
                <div className="align-items-center flex">
                  <input
                    type="radio"
                    value="wire"
                    name="type2"
                    checked={type2 === 'wire'}
                    onChange={() => setType2('wire')}
                  />
                  <label htmlFor="wire" className="ml-2">
                    העברה
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <SubmitButton />
        </div>
      </form>
      {hide && <CancelButton />}
    </div>
  );
}
