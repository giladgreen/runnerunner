'use client';

import { PlayerDB} from '@/app/lib/definitions';
import { undoPlayerLastLog} from "@/app/lib/actions";
import Image from "next/image";
import {usePathname, useSearchParams} from "next/navigation";
import {useState} from "react";
import {AreYouSure} from "@/app/ui/players/client-buttons";

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
    const [showConfirmation, setShowConfirmation] = useState(false);

    const currentPage = `${usePathname()}?${useSearchParams().toString()}`
    return (
      <div >
          <div onClick={() => setShowConfirmation(true)}  className="pointer">
              {formatPlayerEntries(player.entries)}
          </div>
          {showConfirmation && <AreYouSure onConfirm={()=> {
              setShowConfirmation(false);
              undoPlayerLastLog(player.phone_number, currentPage);
          }}
       onCancel={()=>setShowConfirmation(false)}
       subtext="this would revert the last entry"
       text="Undo last player change?"/> }
      </div>
  );
}
