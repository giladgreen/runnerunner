'use client';

import { importPlayers } from '@/app/lib/actions';
import React, { useState } from 'react';
import { PlayerDB } from '@/app/lib/definitions';
import AreYouSure from '@/app/ui/client/AreYouSure';

export default function ImportPlayersButton() {
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <>
      <button onClick={() => setShowConfirmation(true)}>
        <div style={{ zoom: 1.5}}><u>לחץ כאן</u></div>
      </button>
      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        accept=".csv"
      />
      {showConfirmation && (
        <AreYouSure
          onConfirm={() => {
            setShowConfirmation(false);
            // @ts-ignore
            const element = document?.getElementById('fileInput');
            element?.addEventListener('change', function (e) {
              // @ts-ignore
              let file = e?.target?.files[0];

              let reader = new FileReader();
              let nameColumnIndex = 0;
              reader.onload = async function (e) {
                const fileContent = (e?.target?.result ?? '') as string;
                const phoneNumbers = {} as any;
                const fileLines = fileContent
                  .split('\n');

                const firstLine = fileLines[0];
                const firstLineParts = firstLine.split(',');
                if (firstLine.includes('name') && firstLine.includes('balance')) {
                  nameColumnIndex = firstLineParts.findIndex((item) =>
                    item.includes('name'),
                  );
                }else{
                  if (!isNaN(Number(firstLineParts[0].trim().replaceAll('-', '')))) {
                    nameColumnIndex = 1;
                  }else{
                    nameColumnIndex = 0;
                  }
                }

                const players = fileLines
                  .map((line: string) => {
                    if (line.trim().length === 0) {
                      return false;
                    }
                    if (line.includes('name') && line.includes('balance')) {
                      return false;
                    }
                    if (line.includes('שם') && line.includes('קרדיט')) {
                      return false;
                    }
                    const phoneNumberIndex = 1 - nameColumnIndex;

                    const parts = line.split(',');

                    let phoneNumber = parts[phoneNumberIndex]
                      .trim()
                      .replaceAll('-', '');

                    if (!phoneNumber.startsWith('0')) {
                      phoneNumber = '0' + phoneNumber;
                    }

                    const newBalance = Number(parts[2]);
                    const existingPlayer = phoneNumbers[phoneNumber];
                    if (existingPlayer) {
                      if (Number(existingPlayer.balance) < newBalance) {
                        existingPlayer.balance = newBalance;
                      }
                      return null;
                    }

                    const player = {
                      phone_number: phoneNumber,
                      image_url: '',
                      name: parts[nameColumnIndex].trim(),
                      balance: newBalance,
                      notes: '',
                    };

                    phoneNumbers[phoneNumber] = player;

                    return player;
                  })
                  .filter(Boolean) as PlayerDB[];
                const relevantPlayers = players.filter(
                  (player) =>
                    player.balance !== 0 || player.phone_number.length > 6,
                );
                await importPlayers(relevantPlayers);
              };
              reader.readAsText(file);
            });
            element?.click();
          }}
          onCancel={() => setShowConfirmation(false)}
          action="פעולה זאת תמחוק את כל השחקנים הקיימים ואת ההסטוריה שלה ואינה הפיכה"
          question="האם אתה בטוח?"
        />
      )}
    </>
  );
}
