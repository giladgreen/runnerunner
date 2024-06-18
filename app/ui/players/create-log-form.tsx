'use client';

import {
  PencilIcon,
  BanknotesIcon,
  HashtagIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import {createPlayerNewCreditLog, createPlayerUsageLog, setPlayerPosition, setPlayerPrize} from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import {PlayerDB, PlayerForm, TournamentDB} from "@/app/lib/definitions";
import {useEffect, useState} from "react";


export function UseCreditForm({player, tournaments, hide, prevPage, username} : {prevPage:string, player: PlayerDB, tournaments:TournamentDB[], hide?: ()=>void, username?:string}) {

  const initialState = { message: null, errors: {} };
  const createPlayerUsageLogWithPlayerData = createPlayerUsageLog.bind(null,{ player, prevPage, username })
  const now = new Date();
  const dayOfTheWeek = now.toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
  const tournament = tournaments.find(t => t.day.toLowerCase() === dayOfTheWeek);
  // @ts-ignore
  const historyLog = player.historyLog || [];

  const isToday = (date: Date)=>{
    return (new Date()).getTime() - date.getTime() < 12 * 60 * 60 * 1000;
  }
  const todayHistory = historyLog.filter(log => isToday(new Date(log.updated_at)));
  const isRebuy = todayHistory.length > 0;
  const entryText = isRebuy ? 'כניסה נוספת' : 'כניסה';
  const initialNote = `${tournament!.name} - ${entryText}`;
  const initialAmount = isRebuy ?  tournament!.re_buy : tournament!.buy_in;
  // @ts-ignore
  const [state1, dispatch] = useFormState(createPlayerUsageLogWithPlayerData, initialState);
  const [amount, setAmount] = useState(initialAmount);
  const [note, setNote] = useState(initialNote);

  const useCredit = amount < player.balance;
  const [type, setType] = useState(useCredit ? 'credit' : 'cash');

  useEffect(() => {
    if (amount !== initialAmount) {
      setAmount(initialAmount);
    }

    if (note !== initialNote) {
      setNote(initialNote);
    }
  }, [player, tournaments]);
  return (
      <div>
        <form action={dispatch} className="form-control">
          <div className="rounded-md  p-4 md:p-6 form-inner-control">
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
                      onChange={(e) => {  setAmount(Number(e.target.value)) }}
                  />
                  <BanknotesIcon
                      className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
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
                    onChange={(e) => {  setNote(e.target.value) }}

                />

                <PencilIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
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
              <div className="relative rsvp-section">
                <div className="flex flex-wrap justify-content-center gap-3 radio" >
                  <div className="flex align-items-center">
                    <input type="radio" value="credit" name="type"
                           checked={type === 'credit'}
                           onChange={()=>setType('credit')}
                    />
                    <label htmlFor="credit" className="ml-2">Credit</label>
                  </div>
                  <div className="flex align-items-center">
                    <input type="radio" value="cash" name="type"
                           checked={type === 'cash'}
                           onChange={()=>setType('cash')}
                    />
                    <label htmlFor="cash" className="ml-2">Cash</label>
                  </div>
                  <div className="flex align-items-center">
                    <input type="radio" value="wire" name="type"
                           checked={type === 'wire'}
                           onChange={()=>setType('wire')}
                    />
                    <label htmlFor="cash" className="ml-2">Money wire</label>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="mt-6 flex justify-end gap-4">

            <Button type="submit" onClick={()=> hide?.()}> {isRebuy ? 'Rebuy' : 'Buy In'}</Button>

          </div>
        </form>
        {hide && <Button onClick={hide} style={{ marginTop: -52, marginLeft:20}} >Cancel</Button>}
      </div>
  );
}


export function SetPositionForm({player, hide, prevPage} : { player: PlayerForm, hide?: ()=>void, prevPage:string}) {
  const initialState = { message: null, errors: {} };
  const setPlayerPositionWithPlayerId = setPlayerPosition.bind(null,{ playerId: player.id, prevPage})
  // @ts-ignore
  const [state1, dispatch] = useFormState(setPlayerPositionWithPlayerId, initialState);

  return (<div>
        <form action={dispatch} className="form-control">
          <label className="mb-2 block text-sm font-medium">
            Set Player Place
          </label>
          <div className="rounded-md  p-4 md:p-6 form-inner-control">
            {/*  balance change */}
            <div className="mb-4">
              <label htmlFor="position" className="mb-2 block text-sm font-medium">
                Place
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                      id="position"
                      name="position"
                      type="number"
                      step="1"
                      min={0}
                      aria-valuemin={0}
                      placeholder="Enter position"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                      aria-describedby="position-error"
                  />
                  <HashtagIcon
                      className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
                </div>
                <div id="change-error" aria-live="polite" aria-atomic="true">
                  {state1?.errors?.position &&
                      state1?.errors.position.map((error: string) => (
                          <div className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                          </div>
                      ))}
                </div>
              </div>
            </div>

          </div>
          <div className="mt-6 flex justify-end gap-4">

            <Button type="submit" onClick={()=> hide?.()}>Set</Button>

          </div>
        </form>
        {hide && <Button onClick={hide} style={{ marginTop: -52, marginLeft:20}} >Cancel</Button>}
      </div>
  );
}

export function UseCreditForPrizeForm({player} : {player: PlayerForm }) {
  const initialState = { message: null, errors: {} };
  const createPlayerUsageLogWithPlayerData = createPlayerUsageLog.bind(null, { player, prevPage: '/dashboard/players' });

  const initialText = `שחקן המיר קרדיט בפרס`;
  const initialAmount = 1000;
  const [note, setNote] = useState(initialText);
  const [amount, setAmount] = useState(initialAmount);
  // @ts-ignore
  const [state1, dispatch] = useFormState(createPlayerUsageLogWithPlayerData, initialState);

  const [type, setType] = useState('prize');

  return (
        <form action={dispatch} className="form-control">
          <label className="mb-2 block text-sm font-medium">
            Use credit for A Prize
          </label>
          <div className="rounded-md  p-4 md:p-6 form-inner-control">
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
                      step="1"
                      min={0}
                      placeholder="Enter ILS amount"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                      aria-describedby="change-error"
                      onChange={(e) => {
                        setAmount(Number(e.target.value))
                      }}
                      value={amount}
                  />
                  <BanknotesIcon
                      className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
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
                    onChange={(e) => {
                      setNote(e.target.value);
                    }}
                    required
                    value={note}
                />

                <PencilIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
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
              <div className="relative rsvp-section">
                <div className="flex flex-wrap justify-content-center gap-3 radio">
                  <div className="flex align-items-center" style={{ opacity:0.2}}>
                    <input type="radio" value="prize" name="type"
                           checked={type === 'prize'}
                           onChange={() => setType('prize')}
                           disabled
                    />
                    <label htmlFor="credit" className="ml-2">prize</label>
                  </div>

                </div>
              </div>
            </div>

          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button type="submit">Use Credit</Button>
          </div>
        </form>
  );
}

export function AddToBalanceForm({player}: { player: PlayerForm }) {
  const initialState = {message: null, errors: {}};
  const createPlayerNewCreditLogWithPlayerData = createPlayerNewCreditLog.bind(null, { player, prevPage: '/dashboard/players' });
  // @ts-ignore
  const [state2, dispatch] = useFormState(createPlayerNewCreditLogWithPlayerData, initialState);

  return (
      <form action={dispatch} className="form-control">
          <label className="mb-2 block text-sm font-medium">
            Add to Player Credit
          </label>
          <div className="rounded-md p-4 md:p-6 form-inner-control">

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
                      step="1"
                      min={0}
                      required
                      placeholder="Enter ILS change"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                      aria-describedby="change-error"

                  />
                  <BanknotesIcon
                      className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
                </div>
                <div id="change-error" aria-live="polite" aria-atomic="true">
                  {state2?.errors?.change &&
                      state2?.errors?.change.map((error: string) => (
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
                />

                <PencilIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
              </div>
              <div id="note-error" aria-live="polite" aria-atomic="true">
                {state2?.errors?.note &&
                    state2?.errors.note.map((error: string) => (
                        <div className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </div>
                    ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button type="submit">Add</Button>
          </div>
        </form>
  );
}

export default function CreateLogForm({player, tournaments} : {player: PlayerDB, tournaments:TournamentDB[]}) {
  return (
      <div style={{ display: 'flex' , justifyContent: 'space-between'}} >
        <AddToBalanceForm player={player}/>
        <UseCreditForPrizeForm player={player} />

      </div>
  );
}


export function SetPrizeForm({player, hide, prevPage} : { player: PlayerForm, hide?: ()=>void, prevPage:string}) {
  const initialState = { message: null, errors: {} };
  const setPlayerPrizeWithPlayerId = setPlayerPrize.bind(null,{ playerId: player.id, prevPage})
  // @ts-ignore
  const [state1, dispatch] = useFormState(setPlayerPrizeWithPlayerId, initialState);

  return (<div>
        <form action={dispatch} className="form-control">
          <label className="mb-2 block text-sm font-medium">
            Set Player Prize
          </label>
          <div className="rounded-md  p-4 md:p-6 form-inner-control">
            {/*  prize name */}
            <div className="mb-4">
              <label htmlFor="prize" className="mb-2 block text-sm font-medium">
                Prize
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                      id="prize"
                      name="prize"
                      type="text"
                      aria-valuemin={0}
                      placeholder="Enter prize"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                      aria-describedby="prize-error"
                  />

                </div>
                <div id="prize-error" aria-live="polite" aria-atomic="true">
                  {state1?.errors?.prize &&
                      state1?.errors.prize.map((error: string) => (
                          <div className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                          </div>
                      ))}
                </div>
              </div>
            </div>

          </div>
          <div className="mt-6 flex justify-end gap-4">

            <Button type="submit" onClick={()=> hide?.()}>Set</Button>

          </div>
        </form>
        {hide && <Button onClick={hide} style={{ marginTop: -52, marginLeft:20}} >Cancel</Button>}
      </div>
  );
}
