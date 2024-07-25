'use client';

import { PlayerDB, PlayerForm } from '@/app/lib/definitions';
import SetPositionForm from '@/app/ui/client/SetPositionForm';
import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {HashtagIcon} from "@heroicons/react/24/solid";

export default function OpenPositionModalButton({
  player,
}: {
  player: PlayerDB;
}) {
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;
  const [show, setShow] = React.useState(false);

  const close = () => {
    setShow(false);
  };
  return (
      <div>
          <button
              className="pointer rounded-md border p-2 hover:bg-gray-100"
              onClick={() => {
                  setShow(true);
              }}
          >
              <span className="sr-only">Position</span>
              <HashtagIcon className="w-6" title="קסע דירוג"/>
          </button>
          <div className={show ? 'edit-player-modal' : 'hidden'}>
              <SetPositionForm
                  player={player as unknown as PlayerForm}
                  hide={close}
                  prevPage={prevPage}
              />
          </div>
      </div>
  );
}
