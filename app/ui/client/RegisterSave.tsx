'use client';

import { PlayerDB } from '@/app/lib/definitions';
import { useEffect } from 'react';
import { savePlayersDataToFile } from '@/app/ui/client/ExportPlayersButton';

export default function RegisterSave({ players }: { players: PlayerDB[] }) {
  useEffect(() => {
    document.addEventListener(
      'keydown',
      function (e) {
        if (
          e.keyCode === 83 &&
          (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)
        ) {
          e.preventDefault();
          savePlayersDataToFile(players);
        }
      },
      false,
    );
  }, [players]);

  return <div></div>;
}
