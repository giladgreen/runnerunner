'use client';
import { Tooltip, Button } from 'flowbite-react';
import { LogDB, PlayerDB, TournamentDB } from '@/app/lib/definitions';
// @ts-ignore
import { Circle as SpinningChip } from 'react-awesome-spinners'
import React from 'react';
import { createPlayerUsageLog } from '@/app/lib/actions';
import { getCurrentDate } from '@/app/lib/clientDateUtils';
import { useFormState } from 'react-dom';
import { usePathname, useSearchParams } from 'next/navigation';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

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
  const prevAmount = todayHistory.length < 2 ? tournament!.buy_in : tournament!.re_buy;
  // @ts-ignore
  const [state1, dispatch] = useFormState(
    // @ts-ignore
    createPlayerUsageLogWithPlayerData,
    initialState,
  );

  const useCredit = initialAmount <= player.balance;
  const useBothCreditAndCash = initialAmount > player.balance && player.balance > 0;

  const prevUsedCredit = useCredit ? true : todayHistory[todayHistory.length -1]?.type === 'credit';
  const prevUsedCreditAmount = useCredit ? 0 : todayHistory[todayHistory.length -1]?.change ?? 0;
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
    } else if (useBothCreditAndCash){
      result += '.  ';
      result += '₪';
      result += player.balance;
      result += ' מהקרדיט ו-';
      result += '₪';
      result += initialAmount - player.balance;
      result += ' במזומן ';
    } else{
      result += ' במזומן';
    }

    return result;
  };
  const tooltipContent = getTooltipContent();

  const onButtonClick = () => {
    setPending(true);
    if (open) {
      setOpen(false);
    }
    setTimeout(handleClick, 10);
    const historyLog: LogDB[] = player.historyLog;
    historyLog.push({
      updated_at: new Date(),
      id: `${new Date().getTime()}`,
      phone_number: player.phone_number,
      change: useBothCreditAndCash? player.balance : initialAmount,
      change2: useBothCreditAndCash? initialAmount - player.balance : undefined,
      note: initialNote,
      note2: useBothCreditAndCash ? 'שחקן פיצל כניסה' : undefined,
      type: useCredit || useBothCreditAndCash ? 'credit' : 'cash',
      type2: useBothCreditAndCash ? 'cash' : undefined,
    } as unknown as LogDB);

    const newBalance = useCredit ? player.balance - initialAmount : (useBothCreditAndCash ? 0 : player.balance);

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

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const buttonStyle =  {
       borderBottomLeftRadius: 0,
      borderTopLeftRadius: 0,
      paddingTop: 0,
      paddingBottom: 4,
    borderLeft: 0,
  }
  if (pending) {
    return (
      <div
      >
        <Button
          type="submit"
          color="light"
          disabled
          className="SpinningChipWrappingButton"
          style={buttonStyle}
        >
          <SpinningChip color="black" size={19} />
        </Button>
      </div>
    );
  }
  return (
    <form onSubmit={onButtonClick} action={dispatch}>
      <input
        id="change"
        name="change"
        type="number"
        readOnly
        value={useBothCreditAndCash ? player.balance : initialAmount}
        className="hidden"
      />
      <input
        id="change2"
        name="change2"
        type="number"
        readOnly
        value={useBothCreditAndCash ? initialAmount - player.balance : undefined}
        className="hidden"
      />
      <input
        id="note"
        name="note"
        type="text"
        className="hidden"
        readOnly
        value={initialNote}
      />
      <input
        id="note2"
        name="note2"
        type="text"
        className="hidden"
        value={useBothCreditAndCash ? 'שחקן פיצל כניסה' : undefined}
      />

      <input
        id="type"
        name="type"
        type="text"
        className="hidden"
        readOnly
        value={useCredit || useBothCreditAndCash ? 'credit' : 'cash'}
      />
      <input
        id="type2"
        name="type2"
        className="hidden"
        type="text"
        value={useBothCreditAndCash ? 'cash' : undefined}
      />
      <input
        id="split"
        name="split"
        className="hidden"
        type="text"
        value={useBothCreditAndCash ? 'true' : 'false'}
      />
      <Tooltip content={tooltipContent} color="primary">
        <Button
          type="submit"
          color="light"
          disabled={maxRebuyReached}
          className={maxRebuyReached ? ' gray-on-hover bg-gray-500' : ''}
          style={buttonStyle}
        >
          <span style={{ fontSize: 29 }}>₪</span>
        </Button>
        <Snackbar
          className="only-wide-screen"
          open={open}
          autoHideDuration={2000}
          onClose={handleClose}
        >
          <Alert
            icon={false}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
                <span style={{ fontSize: 20 }}>
                  {' '}
                  <b>{player.name}</b>{' '}
                  {' נכנס ב ' +
                    '₪' +
                    prevAmount +
                    (prevUsedCredit && player.balance === 0 && prevUsedCreditAmount > 0 && prevUsedCreditAmount < prevAmount ? 'בקרדיט ומזומן': (prevUsedCredit ? ' מהקרדיט' : ' במזומן'))}{' '}
                </span>
          </Alert>
        </Snackbar>
      </Tooltip>
    </form>
  );
}
