'use client';
// @ts-ignore
import { Circle as SpinningChip } from 'react-awesome-spinners'
import { PlayerDB } from '@/app/lib/definitions';
import { undoPlayerLastLog } from '@/app/lib/actions';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import AreYouSure from '@/app/ui/client/AreYouSure';
import { Tooltip } from '@nextui-org/react';
import { Tooltip as BlackTooltip } from 'flowbite-react';
import Snackbar, {SnackbarCloseReason} from "@mui/material/Snackbar";

const formatPlayerEntries = (
  entries: number,
  isPending: boolean,
  prevEntriesTooltipText?: string[],
  undoTooltipText?: string,
  invert?: boolean
) => {
  if (isPending) {
    return <SpinningChip color="var(--white)"  size={20}/>;
  }

  if (entries < 1) {
    return '';
  }
  if (entries > 5) {
    return entries;
  }

  const map = ['', 'one', 'two', 'three', 'four', 'five'];
  return (
    <Tooltip
      content={
        prevEntriesTooltipText ? (
          <ul className="rtl">
            <div>
              <u>פירוט כניסות:</u>
            </div>
            <div>
              {prevEntriesTooltipText.map((row) => (
                <li key={row}>{row}</li>
              ))}
            </div>
          </ul>
        ) : (
          <div />
        )
      }
      color="warning"
      contentColor={undefined}
      css={undefined}
      enterDelay={1200}
      placement="bottom"
    >
      <BlackTooltip content={undoTooltipText} color="default">
          <div className={invert ? `mobile-entries-wrapper${entries < 3 ? '' : '-disabled'}` :''}>
              <Image
                  src={`/${map[entries]}.png`}
                  alt={`players entries: ${entries}`}
                  className="zoom-on-hover mr-4 hide-on-mobile"
                  width={35}
                  height={35}
              />
              <div className="cellular">{entries}</div>
          </div>


      </BlackTooltip>
    </Tooltip>
  );
};

export default function EntriesButton({
  player,
  updatePlayer,
  invert
}: {
  player: PlayerDB;
  updatePlayer: (p: PlayerDB) => void;
  invert?: boolean;
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [isPending, setIsPending] = useState(false);
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
  const currentPage = `${usePathname()}?${useSearchParams().toString()}`;
  const entriesCount = player.entries ?? 0;
  return (
    <div>
      <div
        onClick={() => {
          setShowConfirmation(true);

        }}
        className="pointer"
      >
        {formatPlayerEntries(
          entriesCount,
            isPending,
            player.entriesTooltipText,
            player.undoEntriesTooltipText,
            invert

        )}
      </div>
        <Snackbar
            className="only-wide-screen"
            open={open}
            autoHideDuration={2000}
            onClose={handleClose}
            message={
                <span style={{fontSize: 18}}>
                    כניסה אחרונה של
                    <b style={{ marginLeft: 5, marginRight: 5}} >{player.name}</b>
                     בוטלה
          </span>
            }


        />

        {showConfirmation && (
            <AreYouSure
                onConfirm={() => {
            setShowConfirmation(false);

            undoPlayerLastLog(player.phone_number, currentPage);
            setIsPending(true);
            const historyLogToRemove =
              player.historyLog[player.historyLog.length - 1];
            const newBalance =
              historyLogToRemove.type === 'credit'
                ? player.balance - historyLogToRemove.change
                : player.balance;
            const entries = player.entries - 1;
            const arrived = entries > 0 ? player.arrived : '';
            setTimeout(() => {
              updatePlayer({
                ...player,
                entries,
                historyLog: player.historyLog.slice(0, -1),
                balance: newBalance,
                arrived,
              });
              setIsPending(false);
              handleClick();
            }, 1000);
          }}
          onCancel={() => {
            setShowConfirmation(false);
          }}
          action={player.undoEntriesTooltipText ?? ''}
          question="האם אתה בטוח?"
        />
      )}
    </div>
  );
}
