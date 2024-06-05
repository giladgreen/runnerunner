'use client';

import {PlayerForm, PlayersTable, TemplateDB} from '@/app/lib/definitions';
import {rsvpPlayerForDay} from "@/app/lib/actions";
import {UseCreditForm} from "@/app/ui/players/create-log-form";
import React from "react";

export default function OpenModalButton({
  player,
  prevPage,
  templates
}: {
  player: PlayersTable;
  prevPage: string;
  templates: TemplateDB[]
}) {

    const [show,setShow] = React.useState(false);

    const close = (e: any)=>{
        setShow(false);
    }
    return (
      <div>
          <div onClick={() => {
              setShow(true);
          }} style={{ fontSize:'24', cursor: 'pointer'}}>🪙</div>
          <div className={show ? 'edit-player-modal' : 'hidden'}>
              <UseCreditForm player={player as unknown as PlayerForm} templates={templates} hide={close}/>
          </div>
      </div>
  );
}

