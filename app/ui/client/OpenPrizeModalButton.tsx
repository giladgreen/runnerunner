'use client';

import {PlayerDB, PlayerForm, PrizeInfoDB} from '@/app/lib/definitions';
import React from 'react';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import SetPrizeForm from '@/app/ui/client/SetPrizeForm';

export default function OpenPrizeModalButton({ player, prizesInformation }: { player: PlayerDB, prizesInformation: PrizeInfoDB[] }) {
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;
  const [show, setShow] = React.useState(false);

  const close = () => {
    setShow(false);
  };
  return (
    <div>
      <div
        onClick={() => {
          setShow(true);
        }}
        className="pointer"
        style={{ fontSize: '24' }}
      >
        <Image
          title={'prize'}
          src={`/prize.png`}
          alt={`prize`}
          className="zoom-on-hover mr-4"
          width={35}
          height={35}
        />
      </div>
      <div className={show ? 'edit-player-modal' : 'hidden'}>
        <SetPrizeForm
          player={player as unknown as PlayerForm}
          hide={close}
          prevPage={prevPage}
          prizesInformation={prizesInformation}
        />
      </div>
    </div>
  );
}
