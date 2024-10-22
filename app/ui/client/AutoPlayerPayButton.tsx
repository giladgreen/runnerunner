'use client';
import { Tooltip, Button } from 'flowbite-react';
import { PlayerDB, TournamentDB } from '@/app/lib/definitions';

import React from 'react';
import { createPlayerUsageLog } from '@/app/lib/actions';
import { getCurrentDate } from '@/app/lib/clientDateUtils';
import { useFormState } from 'react-dom';
import { usePathname, useSearchParams } from 'next/navigation';
import Spinner from '@/app/ui/client/Spinner';

export default function AutoPlayerPayButton({
  player,
  userId,
  tournaments,
  tournamentId,
}: {
  player: PlayerDB;
  tournaments: TournamentDB[];
  tournamentId: string | null;
  userId: string;
}) {
  const initialState = { message: null, errors: {} };
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;

  const [pending, setPending] = React.useState(false);

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

  const useCredit = initialAmount < player.balance;

  const getTooltipContent = () => {
    if (maxRebuyReached) {
      return 'שחקן הגיע למספר הכניסות המירבי';
    }
    let result = 'הכנס שחקן ';
    result += '₪';
    result += initialAmount;

    if (isRebuy) {
      result += ' (כניסה נוספת) ';
    }
    if (useCredit) {
      result += ' מהקרדיט';
    } else {
      result += ' במזומן';
    }

    return result;
  };
  const tooltipContent = getTooltipContent();

  const onButtonClick = () => {
    setPending(true);
    setTimeout(() => {
      setPending(false);
    }, 5000);
  };

  return (
    <>
      {pending && (
        <div
          style={{
            border: '1px solid white',
            borderRadius: 3,
            marginRight: 8,
            marginTop: 5,
            width: 40,
          }}
        >
          <Spinner size={33} />
        </div>
      )}

      {!pending && (
        <form onSubmit={onButtonClick} action={dispatch}>
          <input
            id="change"
            name="change"
            type="number"
            step="1"
            min={1}
            value={initialAmount}
            style={{ visibility: 'hidden', display: 'none' }}
          />
          <input
            id="note"
            name="note"
            type="text"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="note-error"
            value={initialNote}
            style={{ visibility: 'hidden', display: 'none' }}
          />

          <input
            id="type"
            name="type"
            type="text"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="note-error"
            value={useCredit ? 'credit' : 'cash'}
            style={{ visibility: 'hidden', display: 'none' }}
          />

          <Tooltip content={tooltipContent} color="primary">
            <Button
              type="submit"
              color="light"
              disabled={maxRebuyReached}
              className={maxRebuyReached ? ' gray-on-hover bg-gray-500' : ''}
            >
              <span style={{ fontSize: 30 }}>₪</span>
            </Button>
          </Tooltip>
        </form>
      )}
    </>
  );
}
