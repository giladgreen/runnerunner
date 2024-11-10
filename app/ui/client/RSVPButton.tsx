'use client';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';

// @ts-ignore
import React, { startTransition, useOptimistic } from 'react';
import { PlayerDB } from '@/app/lib/definitions';
import { rsvpPlayerForDay } from '@/app/lib/actions';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/dist/client/components/navigation';
import { getTodayDate } from '@/app/lib/clientDateUtils';
import { Switch } from '@nextui-org/react';
import Alert from "@mui/material/Alert";

export default function RSVPButton({
  player,
  stringDate,
  tournamentId,
  text,
  boldText,
  disabled,
}: {
  player: PlayerDB;
  text?: string;
  boldText?: string;
  stringDate?: string;
  tournamentId: string;
  disabled?: boolean;
}) {
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;
  const date = stringDate ?? getTodayDate();
  const isRsvpForDate = Boolean(
    player.rsvps.find(
      (r) => r.date === date && r.tournamentId === tournamentId,
    ),
  );

  const [optimisticIsRsvpForDate, addOptimisticIsRsvpForDate] =
    useOptimistic<boolean>(isRsvpForDate, (state: boolean) => !state);

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const onClick = () => {
    if (open) {
      setOpen(false);
    }
    setTimeout(handleClick, 10);

    startTransition(() => {
      addOptimisticIsRsvpForDate(!isRsvpForDate);
    });

    rsvpPlayerForDay(
      player.phone_number,
      date,
      tournamentId,
      !isRsvpForDate,
      prevPage,
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', margin: '5px 0' }} onClick={onClick}>
        <Switch
          disabled={disabled}
          initialChecked={optimisticIsRsvpForDate}
          onClick={onClick}
        />
        <div style={{ marginTop: 3, marginRight: 5 }}>{text}</div>
      </div>
      {boldText && (
        <div style={{ marginTop: 4, marginBottom: 30 }}>
          <b>{boldText}</b>
        </div>
      )}
      <Snackbar
        className="only-wide-screen"
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert
            icon={false}
            severity="info"
            variant="filled"
            sx={{width: '100%'}}
        >
              <span style={{fontSize: 20}}>

                <b>{player.name}</b>{' '}
                {!isRsvpForDate ? 'אישר הגעה' : 'ביטל רישום הגעה'}{' '}
          </span>
        </Alert>
      </Snackbar>
    </div>
  );
}
