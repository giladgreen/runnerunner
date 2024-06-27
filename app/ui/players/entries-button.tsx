'use client';

import { PlayerDB} from '@/app/lib/definitions';
import { undoPlayerLastLog} from "@/app/lib/actions";
import Image from "next/image";
import {usePathname, useSearchParams} from "next/navigation";

const formatPlayerEntries = (
    entries: number,
) => {
    if (entries < 1) {
        return '';
    }
    if (entries >5 ) {
        return entries;
    }

    const map = ['','one', 'two', 'three', 'four', 'five'];
    return <Image
        src={`/${map[entries]}.png`}
        alt={`platers entries: ${entries}`}
        className="mr-4 zoom-on-hover"
        width={35}
        height={35}
    />
};


export default function EntriesButton({
  player,
}: {
  player: PlayerDB;
}) {
    const currentPage = `${usePathname()}?${useSearchParams().toString()}`
    return (
      <div onClick={() => {
          if (confirm("Undo last player change?")) {
              undoPlayerLastLog(player.phone_number, currentPage)
          }


      }}  className="pointer">
          {formatPlayerEntries(player.entries)}
      </div>
  );
}
