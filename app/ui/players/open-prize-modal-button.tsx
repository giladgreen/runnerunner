'use client';

import {PlayerDB, PlayerForm} from '@/app/lib/definitions';
import {SetPositionForm, SetPrizeForm} from "@/app/ui/players/create-log-form";
import React from "react";
import Image from "next/image";

export default function OpenPrizeModalButton({
  player,
  prevPage
}: {
  player: PlayerDB;
  prevPage: string;
}) {
    const [show,setShow] = React.useState(false);

    const close = ()=>{
        setShow(false);
    }
    return (
      <div>
          <div onClick={() => {
              setShow(true);
          }} className="pointer" style={{ fontSize:'24'}}>
              <Image
                  title={'prize'}
                  src={`/prize.png`}
                  alt={`prize`}
                  className="mr-4 zoom-on-hover"
                  width={35}
                  height={35}
                  />
          </div>
          <div className={show ? 'edit-player-modal' : 'hidden'}>
              <SetPrizeForm player={player as unknown as PlayerForm} hide={close} prevPage={prevPage}/>
          </div>
      </div>
  );
}

