"use client";

import { TrashIcon } from '@heroicons/react/24/outline';
import {
    deletePlayer, deletePrize,
    importPlayers,
} from '@/app/lib/actions';
import {Button} from "@/app/ui/button";
import React, {useState} from "react";
import {PlayerDB, PrizeDB, TournamentDB} from "@/app/lib/definitions";
import {usePathname} from "next/navigation";
import {useSearchParams} from "next/dist/client/components/navigation";

export function AreYouSure({onConfirm, onCancel, text}:{text: string, onConfirm:()=>void, onCancel:()=>void}) {

  return (<div className="confirmation-modal-wrapper">
      <div className="confirmation-modal">
          <div>{text}</div>
          <div className="confirmation-modal-buttons">
              <button className="rounded-md border p-2 hover:bg-gray-100" onClick={onCancel}>
                  <span >Cancel</span>
              </button>
              <button className="rounded-md border p-2 hover:bg-gray-100" onClick={()=>{
                  console.log('onConfirm')

                  onConfirm();
              }}>
                  <span >Yes</span>
              </button>
          </div>
      </div>

  </div>);
}

export function DeletePlayer({id}: { id: string }) {
    const deletePlayerWithId = deletePlayer.bind(null, id);
    const [showConfirmation, setShowConfirmation] = useState(false);

    return <div>
        <button className="rounded-md border p-2 hover:bg-gray-100" onClick={() => {
            setShowConfirmation(true);
          }
        }>
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5"/>
        </button>
        {showConfirmation && <AreYouSure onConfirm={()=>{
            console.log('calling deletePlayerWithId')
            deletePlayerWithId();
        }}
                                         onCancel={()=>setShowConfirmation(false)}
                                         text="Delete Player?"/> }
    </div>;
}

export function ImportPlayers() {

    return (
        <>
            <Button
            onClick={() => {
                if (confirm("This would delete all existing player and their history, Are you sure?")) {
                    // @ts-ignore
                    const element = document?.getElementById('fileInput');
                    element?.addEventListener('change', function(e){
                        // @ts-ignore
                        let file = e?.target?.files[0];

                        let reader = new FileReader();
                        reader.onload = async function(e){
                            const fileContent = (e?.target?.result ?? '') as string;
                            const players = fileContent.split('\n').map((line: string) => {
                                if (line.trim().length === 0){
                                    return false;
                                }
                                if (line.includes('name') && line.includes('balance')){
                                    return false;
                                }
                                const parts = line.split(',');
                                const player = {
                                    phone_number: parts[0].trim().replaceAll('-', ''),
                                    image_url: '',
                                    name: parts[1].trim(),
                                    balance: Number(parts[2]),
                                    notes: '',
                                }
                                if (!player.phone_number.startsWith('0')){
                                    player.phone_number = '0' + player.phone_number;
                                }
                                if (!player.notes){
                                    player.notes = ''
                                }else{
                                    player.notes = player.notes.trim()
                                }
                                return player;
                            }).filter(Boolean) as PlayerDB[];
                            const relevantPlayers = players.filter((player) => player.balance !== 0 || player.phone_number.length > 6);
                            await importPlayers(relevantPlayers);
                        };
                        reader.readAsText(file);
                    });
                    element?.click();
                }


            }}
                >

            <span >import</span>
            </Button>
            <input type="file" id="fileInput" style={{ display:'none'}} accept=".csv"/>

        </>
            );
            }

export function ExportPlayers({ players, playersPlaces, worker, tournament, prizes, prizesEnabled, placesEnabled}: { players: PlayerDB[], playersPlaces:PlayerDB[], tournament: TournamentDB, prizes: PrizeDB[], worker?: boolean, prizesEnabled?: boolean, placesEnabled?: boolean}) {

    return (
        <>
            <Button
            onClick={() => {
                const todayDate = (new Date()).toISOString().slice(0,10);

                const creditData =`phone number, name, balance, notes
${players.sort((a,b)=> a.balance < b.balance ? 1 : -1).map((player) => {
                    return `${player.phone_number},${player.name},${player.balance},${player.notes}`
                }).join(`
`)}`;
                const creditFilename = `players_credit_${todayDate}.csv`;
                const creditBlob = new Blob([creditData], {type: "text/plain;charset=utf-8"});

                const creditLink = document.createElement("a");
                creditLink.download = creditFilename;
                creditLink.href = window.URL.createObjectURL(creditBlob);
                creditLink.style.display = 'none';

                document.body.appendChild(creditLink);

                creditLink.click();

                document.body.removeChild(creditLink);
                ////////////////////////////////////////////////////////////////
                if (!placesEnabled && !prizesEnabled){
                    return;
                }
                if (worker) {
                    return
                }
                const addPlaces = placesEnabled && playersPlaces && playersPlaces.length > 0;
                const addPrizes = prizesEnabled && prizes && prizes.length > 0;
                const filename = `players_${addPlaces && addPrizes ? 'places_and_prizes' : (addPlaces ? 'places' : 'prizes')}.csv`;

                const placesData = addPlaces ? `position, phone number, name 
${playersPlaces.map((player) => {
                    return `${player.position}, ${player.phone_number},${player.name}`
                }).join('\n')}` : '';

                const prizesData = addPrizes ? `Name, phone number, prize, tournament
${prizes.map(prize => `${prize!.player!.name}, ${prize!.phone_number}, ${prize.prize},  ${prize.tournament}`).join('\n')}` : '';

                const fileData = `${tournament.name}

${placesData}

${prizesData}


`;

                    const dataBlob = new Blob([fileData], {type: "text/plain;charset=utf-8"});

                    const dataLink = document.createElement("a");
                    dataLink.download = filename;
                    dataLink.href = window.URL.createObjectURL(dataBlob);
                    dataLink.style.display = 'none';

                    document.body.appendChild(dataLink);

                    dataLink.click();

                    document.body.removeChild(dataLink);
            }} >

            <span >export</span>
            </Button>
            <input type="file" id="fileInput" style={{ display:'none'}} accept=".csv"/>

        </>
            );
            }

export function DeletePrize({ id }: { id: string }) {
    const prevPage = `${usePathname()}?${useSearchParams().toString()}`

    const deletePrizeWithId = deletePrize.bind(null, { id, prevPage});

    return (
        <div className="pointer" onClick={()=>{

            if (confirm("Are you sure?")) {
                deletePrizeWithId();
            }
        }}>
            <u>prize delivered</u>
        </div>
    );
}
