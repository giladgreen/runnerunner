'use client';

import { PlayerDB } from '@/app/lib/definitions';
import { undoPlayerLastLog } from '@/app/lib/actions';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import AreYouSure from '@/app/ui/client/AreYouSure';
import Spinner from '@/app/ui/client/Spinner';
import { Tooltip } from '@nextui-org/react';
import { Tooltip as BlackTooltip } from 'flowbite-react';

const formatPlayerEntries = (
  entries: number,
  isPending: boolean,
  prevEntriesTooltipText?: string[],
  undoTooltipText?: string,
) => {
  if (isPending) {
    return <Spinner size={30} />;
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
        content={prevEntriesTooltipText ? <ul className="rtl">
          <div><u>פירוט כניסות:</u></div>
          <div>
          {prevEntriesTooltipText.map(row => (<li key={row}>{row}</li>))}
          </div></ul> : <div/>}
      color="success"
      contentColor={undefined}
      css={undefined}
      enterDelay={1200}
      placement="bottom"
    >
      <BlackTooltip content={undoTooltipText} color="default">
        <Image
          src={`/${map[entries]}.png`}
          alt={`players entries: ${entries}`}
          className="zoom-on-hover mr-4"
          width={35}
          height={35}
        />
      </BlackTooltip>
    </Tooltip>
  );
};

export default function EntriesButton({
  player,
  updatePlayer,
}: {
  player: PlayerDB;
  updatePlayer: (p: PlayerDB) => void;
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [isPending, setIsPending] = useState(false);

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
        )}
      </div>
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
            }, 1000);
          }}
          onCancel={() => {
            setShowConfirmation(false);
          }}
          text="ביטול הכניסה האחרונה של השחקן"
          subtext={ player.undoEntriesTooltipText ?? ''}
        />
      )}
    </div>
  );
}
