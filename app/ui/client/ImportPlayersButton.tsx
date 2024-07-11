"use client";

import {
    importPlayers,
} from '@/app/lib/actions';
import Button from '@/app/ui/client/Button';
import React, {useState} from "react";
import {PlayerDB} from "@/app/lib/definitions";
import AreYouSure from "@/app/ui/client/AreYouSure";

export default function ImportPlayersButton() {
    const [showConfirmation, setShowConfirmation] = useState(false);

    return (
        <>
            <Button
            onClick={() => setShowConfirmation(true)}>
            <span >import</span>
            </Button>
            <input type="file" id="fileInput" style={{ display:'none'}} accept=".csv"/>
            {showConfirmation && <AreYouSure onConfirm={()=>{
                setShowConfirmation(false);
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
             onCancel={()=>setShowConfirmation(false)}
             subtext="This would delete all existing players and their history"
             text="Are you sure?"/> }
        </>
            );
            }

