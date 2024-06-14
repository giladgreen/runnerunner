'use client';

import {PlayerDB, TournamentDB} from '@/app/lib/definitions';
import {UseCreditForm} from "@/app/ui/players/create-log-form";
import React from "react";
import Image from "next/image";

export default function OpenModalButton({
  player,
  prevPage,
  username,
tournaments
}: {
  player: PlayerDB;
  tournaments: TournamentDB[];
  prevPage: string;
  username?: string;
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
                  title={'pay'}
                  src={`/pay.png`}
                  alt={`pay`}
                  className="mr-4 zoom-on-hover"
                  width={35}
                  height={35}
                  />
          </div>
          <div className={show ? 'edit-player-modal' : 'hidden'}>
              <UseCreditForm player={player} tournaments={tournaments} hide={close} prevPage={prevPage} username={username}/>
          </div>
      </div>
  );
}

