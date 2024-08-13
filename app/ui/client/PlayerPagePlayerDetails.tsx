'use client';

import { formatCurrency, formatCurrencyColor } from '@/app/lib/utils';
import Image from 'next/image';
import React from 'react';
import { PlayerDB} from "@/app/lib/definitions";

export default function PlayerPagePlayerDetails({
  player,
}: {
  player: PlayerDB;
}) {
  return <div className="rtl" style={{marginTop: 50}}>
    <div style={{zoom: 2}}>
        <u><b>פרטי שחקן</b></u>
    </div>
    <div style={{marginTop: 10}}>
        <Image
             src={player.image_url}
             alt={`${player.name}'s profile picture`}
             width={222}
             height={222}
         />
         <div
             className="truncate font-semibold"
             style={{margin: '2px 10px', zoom: 2}}
         >
           {player.name}
         </div>
         <div
             className="truncate font-semibold"
             style={{margin: '2px 10px', zoom: 1.4, color: 'blue'}}
         >
           {player.phone_number}
         </div>
         <div>
           <span style={{ fontSize:40}}>קרדיט:</span>
           <b style={{marginRight: 5}}>
             {player.balance < 0 ? 'חוב של' : ''}
           </b>
           <span
               className="truncate font-semibold"
               style={{
                 zoom: 2.2,
                 color: formatCurrencyColor(player.balance),
               }}
           >
           <b> {formatCurrency(Math.abs(player.balance))}</b>
         </span>

         </div>
       </div>
  </div>
      }
