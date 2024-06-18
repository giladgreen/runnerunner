"use client";

import { TrashIcon } from '@heroicons/react/24/outline';
import {
    deletePlayer,
    importPlayers,
    resetAllPlayersAndHistory,
} from '@/app/lib/actions';
import {Button} from "@/app/ui/button";
import React from "react";
import {PlayerDB} from "@/app/lib/definitions";

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
                                player.notes = 'imported player'
                            }else{
                                player.notes = player.notes.trim()
                            }
                            return player;
                        }).filter(Boolean) as PlayerDB[];

                        await importPlayers(players);
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

export function ExportPlayers({ players, playersPlaces}: { players: PlayerDB[], playersPlaces:PlayerDB[]}) {

    return (
        <>
            <Button
            onClick={() => {
                const creditData = players.map((player) => {
                    return `${player.phone_number},${player.name},${player.balance},${player.notes}`
                }).join('\n');
                const creditFilename = "players_credit.csv";
                const creditBlob = new Blob([creditData], {type: "text/plain;charset=utf-8"});

                const creditLink = document.createElement("a");
                creditLink.download = creditFilename;
                creditLink.href = window.URL.createObjectURL(creditBlob);
                creditLink.style.display = 'none';

                document.body.appendChild(creditLink);

                creditLink.click();

                document.body.removeChild(creditLink);
////////////////////////////////////////////////////////////////

                const placesData = playersPlaces.map((player) => {
                    return `${player.position}, ${player.phone_number},${player.name}`
                }).join('\n');
                const placesFilename = "today_players_places.csv";
                const todayplacesData = `position, phone number, name
${placesData}`
                const placesBlob = new Blob([todayplacesData], {type: "text/plain;charset=utf-8"});

                const placesLink = document.createElement("a");
                placesLink.download = placesFilename;
                placesLink.href = window.URL.createObjectURL(placesBlob);
                placesLink.style.display = 'none';

                document.body.appendChild(placesLink);

                placesLink.click();

                document.body.removeChild(placesLink);
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
