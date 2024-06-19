'use client';

import { PlayerDB} from '@/app/lib/definitions';
import { undoPlayerLastLog} from "@/app/lib/actions";
import Image from "next/image";

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
    return (
      <div onClick={() => {
          if (confirm("Undo last player change?")) {
              undoPlayerLastLog(player.phone_number)
          }


      }}  className="pointer">
          {formatPlayerEntries(player.entries)}
      </div>
  );
}
