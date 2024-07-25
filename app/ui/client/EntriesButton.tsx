'use client';

import { PlayerDB } from '@/app/lib/definitions';
import { undoPlayerLastLog } from '@/app/lib/actions';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import AreYouSure from '@/app/ui/client/AreYouSure';
import Spinner from '@/app/ui/client/Spinner';

const formatPlayerEntries = (entries: number, isPending: boolean) => {
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
    <Image
      src={`/${map[entries]}.png`}
      alt={`players entries: ${entries}`}
      className="zoom-on-hover mr-4"
      width={35}
      height={35}
    />
  );
};

export default function EntriesButton({ player }: { player: PlayerDB }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [isPending, setIsPending] = useState(false);

  const currentPage = `${usePathname()}?${useSearchParams().toString()}`;
  return (
    <div>
      <div
        onClick={() => {
          setShowConfirmation(true);
        }}
        className="pointer"
      >
        {formatPlayerEntries(player.entries ?? 0, isPending)}
      </div>
      {showConfirmation && (
        <AreYouSure
          onConfirm={() => {
            setShowConfirmation(false);
            undoPlayerLastLog(player.phone_number, currentPage);
            setIsPending(true);
            setTimeout(() => setIsPending(false), 1600);
          }}
          onCancel={() => {
            setShowConfirmation(false);
          }}
          subtext="ביטול הכניסה האחרונה של השחקן"
          text="ביטול כניסה אחרונה?"
        />
      )}
    </div>
  );
}
