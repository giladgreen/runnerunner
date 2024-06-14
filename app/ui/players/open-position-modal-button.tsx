'use client';

import {PlayerDB, PlayerForm} from '@/app/lib/definitions';
import {SetPositionForm} from "@/app/ui/players/create-log-form";
import React from "react";
import Image from "next/image";

export default function OpenPositionModalButton({
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
          }} style={{ fontSize:'24', cursor: 'pointer'}}>
              <Image
                  title={'podium'}
                  src={`/podium.png`}
                  alt={`podium`}
                  className="mr-4 zoom-on-hover"
                  width={35}
                  height={35}
                  />
          </div>
          <div className={show ? 'edit-player-modal' : 'hidden'}>
              <SetPositionForm player={player as unknown as PlayerForm} hide={close} prevPage={prevPage}/>
          </div>
      </div>
  );
}

