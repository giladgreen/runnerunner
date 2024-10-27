'use client';
import { Tooltip, Button } from 'flowbite-react';
import { LogDB, PlayerDB, TournamentDB } from '@/app/lib/definitions';

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
  updatePlayer,
}: {
  player: PlayerDB;
  tournaments: TournamentDB[];
  tournamentId: string | null;
  userId: string;
  updatePlayer: (p: PlayerDB) => void;
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
    const historyLog: LogDB[] = player.historyLog;
    historyLog.push({
      updated_at: new Date(),
      id: `${new Date().getTime()}`,
      phone_number: player.phone_number,
      change: initialAmount,
      note: initialNote,
      type: useCredit ? 'credit' : 'cash',
    } as unknown as LogDB);

    const newBalance = useCredit
      ? player.balance - initialAmount
      : player.balance;
    const arrived = tournamentId ? tournamentId : undefined;

    setTimeout(() => {
      updatePlayer({
        ...player,
        historyLog,
        entries: player.entries + 1,
        balance: newBalance,
        arrived,
      });
      setPending(false);
    }, 1000);
  };

  return (
    <>
      {(pending) && (
        <div
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: 3,
            marginRight: 0,
            marginTop: 0,
            width: 60,
            borderBottomRightRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 4,
            borderTopLeftRadius: 4,
            paddingTop:5,
            paddingRight:10,
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
            readOnly
            value={initialAmount}
            style={{ visibility: 'hidden', display: 'none' }}
          />
          <input
            id="note"
            name="note"
            type="text"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            readOnly
            value={initialNote}
            style={{ visibility: 'hidden', display: 'none' }}
          />

          <input
            id="type"
            name="type"
            type="text"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            readOnly
            value={useCredit ? 'credit' : 'cash'}
            style={{ visibility: 'hidden', display: 'none' }}
          />

          <Tooltip content={tooltipContent} color="primary">
            <Button
              type="submit"
              color="light"
              disabled={maxRebuyReached}
              className={maxRebuyReached ? ' gray-on-hover bg-gray-500' : ''}
              style={{ borderBottomRightRadius: 0, borderTopRightRadius: 0, paddingTop:0, paddingBottom: 4 }}
            >
              <span style={{ fontSize: 29 }}>₪</span>
            </Button>
          </Tooltip>
        </form>
      )}
    </>
  );
}
