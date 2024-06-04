'use client';

import {
  PencilIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import {createPlayerNewCreditLog, createPlayerUsageLog, fetchTemplates} from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import {PlayerForm, TemplateDB} from "@/app/lib/definitions";
import {useState} from "react";
import {Checkbox} from "primereact/checkbox";
const TEXTS = {
}

const AMOUNTS = {
}

function initialTemplates(templates: TemplateDB[]) {
  if (Object.keys(TEXTS).length !== 0) {
    return;
  }

  templates.forEach((template) => {
    // @ts-ignore
    TEXTS[template.day] = template.template;
    // @ts-ignore
    AMOUNTS[template.day] = template.amount;
  })

}
function getInitialText(): string {
  const now = new Date();
  const dayOfTheWeek = now.toLocaleString('en-us', { weekday: 'long' });
  const savedDayOfTheWeek = localStorage.getItem('day-of-the-week');
  let newDay = true;
  if (savedDayOfTheWeek){
   if (savedDayOfTheWeek === dayOfTheWeek){
     newDay = false;
   }
  } else{
    localStorage.setItem('day-of-the-week', dayOfTheWeek);
  }

  // @ts-ignore
  let result: string = TEXTS[dayOfTheWeek] ? TEXTS[dayOfTheWeek] as string : '';

  const storedText = newDay ? result : localStorage.getItem('use-balance-note-text');

  if (!storedText){
    localStorage.setItem('use-balance-note-text', result);
  }else{
    result = storedText;
  }
  return result;
}

function getInitialAmount(): number {
  const now = new Date();
  const dayOfTheWeek = now.toLocaleString('en-us', { weekday: 'long' });

  // @ts-ignore
  let result: number = AMOUNTS[dayOfTheWeek] ? AMOUNTS[dayOfTheWeek] as number : 300;
  const storedText = localStorage.getItem('use-balance-amount');

  if (!storedText){
    localStorage.setItem('use-balance-amount', `${result}`);
  }else{
    result = Number(storedText);
  }
  return result;
}

export default function Form({player, templates} : {player: PlayerForm, templates:TemplateDB[]}) {
  initialTemplates(templates);
  const initialState = { message: null, errors: {} };
  const createPlayerUsageLogWithPlayerData = createPlayerUsageLog.bind(null, player);
  const createPlayerNewCreditLogWithPlayerData = createPlayerNewCreditLog.bind(null, player);

  const initialText = getInitialText();
  const initialAmount = getInitialAmount();
  const [note, setNote] = useState(initialText);
  const [amount, setAmount] = useState(initialAmount);
  // @ts-ignore
  const [state1, dispatch1] = useFormState(createPlayerUsageLogWithPlayerData, initialState);
  // @ts-ignore
  const [state2, dispatch2] = useFormState(createPlayerNewCreditLogWithPlayerData, initialState);

  const [type, setType] = useState('credit');
  //add radio buttons: credit / cash / bank transfer

  return (
      <div style={{ display: 'flex' , justifyContent: 'space-between'}} >
        <form action={dispatch1} className="form-control">
          <label className="mb-2 block text-sm font-medium">
            Pay up
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
                      step="10"
                      min={0}
                      placeholder="Enter ILS amount"
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                      aria-describedby="change-error"
                      onChange={(e) => {
                        setAmount(Number(e.target.value))
                        localStorage.setItem('use-balance-amount', e.target.value);
                      }}
                      value={amount}
                  />
                  <BanknotesIcon
                      className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
                </div>
                <div id="change-error" aria-live="polite" aria-atomic="true">
                  {state1?.errors?.change &&
                      state1?.errors.change.map((error: string) => (
                          <p className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                          </p>
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
                      localStorage.setItem('use-balance-note-text', e.target.value);

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
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
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
                    <input type="radio" value="bank" name="type"
                           checked={type === 'bank'}
                           onChange={()=>setType('bank')}
                    />
                    <label htmlFor="cash" className="ml-2">Bank Transfer</label>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button type="submit">Use</Button>
          </div>
        </form>
        <form action={dispatch2} className="form-control">
          <label className="mb-2 block text-sm font-medium">
            Add to Balance
          </label>
          <div className="rounded-md p-4 md:p-6 form-inner-control">

            {/*  balance change */}
            <div className="mb-4">
              <label htmlFor="change" className="mb-2 block text-sm font-medium">
                Added Credit
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
                          <p className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                          </p>
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
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button type="submit">Add</Button>
          </div>
        </form>
      </div>
  );
}
