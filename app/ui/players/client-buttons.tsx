"use client";

import { TrashIcon } from '@heroicons/react/24/outline';
import {
    deletePlayer, deletePrize,
    importPlayers,
    resetAllPlayersAndHistory,
} from '@/app/lib/actions';
import {Button} from "@/app/ui/button";
import React from "react";
import {PlayerDB, PrizeDB, TournamentDB} from "@/app/lib/definitions";

export function DeletePlayer({ id }: { id: string }) {
  const deletePlayerWithId = deletePlayer.bind(null, id);

  const onSubmit = (formData: FormData) => {
    if (confirm("Are you sure?")) {
      deletePlayerWithId();
    }
  };


  return (
      <form action={onSubmit}>
        <button className="rounded-md border p-2 hover:bg-gray-100">
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5"/>
        </button>
      </form>
  );
}

export function ImportPlayers() {

    return (
        <>
            <Button
            onClick={() => {

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

            }}
                >

            <span >import</span>
            </Button>
            <input type="file" id="fileInput" style={{ display:'none'}} accept=".csv"/>

        </>
            );
            }

export function ExportPlayers({ players, playersPlaces, worker, tournament, prizes}: { players: PlayerDB[], playersPlaces:PlayerDB[], tournament: TournamentDB, prizes: PrizeDB[], worker?: boolean}) {

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
                if (!worker && playersPlaces && playersPlaces.length) {
                    const placesData = playersPlaces.map((player) => {
                        return `${player.position}, ${player.phone_number},${player.name}`
                    }).join('\n');
                    const placesFilename = `players_places_${todayDate}.csv`;
                    const todayPlacesData = `${tournament.name}
position, phone number, name
${placesData}


${prizes.length ? `Name, phone number, prize, tournament
${prizes.map(prize => `${prize!.player!.name}, ${prize!.phone_number}, ${prize.prize},  ${prize.tournament}`).join(`
`)}` :''}
`;

                    const placesBlob = new Blob([todayPlacesData], {type: "text/plain;charset=utf-8"});

                    const placesLink = document.createElement("a");
                    placesLink.download = placesFilename;
                    placesLink.href = window.URL.createObjectURL(placesBlob);
                    placesLink.style.display = 'none';

                    document.body.appendChild(placesLink);

                    placesLink.click();

                    document.body.removeChild(placesLink);
                }
            }}
                >

            <span >export</span>
            </Button>
            <input type="file" id="fileInput" style={{ display:'none'}} accept=".csv"/>

        </>
            );
            }

export function ResetPlayersAndHistory() {
    return (
        <>
            <Button
                onClick={async () => {
                    if (confirm("Are you sure?")) {
                        await resetAllPlayersAndHistory();
                    }
                }}
            >
                <span >Reset</span>
            </Button>
            <input type="file" id="fileInput" style={{ display:'none'}} accept=".csv"/>

        </>
    );
}

export function DeletePrize({ id, prevPage }: { id: string, prevPage:string }) {
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
