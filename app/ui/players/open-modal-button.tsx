'use client';

import {PlayerDB, TournamentDB} from '@/app/lib/definitions';
import {UseCreditForm} from "@/app/ui/players/create-log-form";
import React from "react";
import Image from "next/image";
import {usePathname, useSearchParams} from "next/navigation";

export default function OpenModalButton({
  player,
  username,
  tournaments
}: {
  player: PlayerDB;
  tournaments: TournamentDB[];
  username?: string;
}) {
    const prevPage = `${usePathname()}?${useSearchParams().toString()}`;
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

