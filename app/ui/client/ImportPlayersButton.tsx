'use client';

import { importPlayers } from '@/app/lib/actions';
import Button from '@/app/ui/client/Button';
import React, { useState } from 'react';
import { PlayerDB } from '@/app/lib/definitions';
import AreYouSure from '@/app/ui/client/AreYouSure';

export default function ImportPlayersButton() {
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <>
      <Button onClick={() => setShowConfirmation(true)}>
        <div style={{ textAlign: 'center', width: '100%' }}>לחץ כאן</div>
      </Button>
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

                const players = fileContent
                  .split('\n')
                  .map((line: string) => {
                    if (line.trim().length === 0) {
                      return false;
                    }
                    if (line.includes('name') && line.includes('balance')) {
                        const lineParts = line.split(',');
                        nameColumnIndex = lineParts.findIndex(item => item.includes('name'));
                      return false;
                    }
                    const parts = line.split(',');

                    let phoneNumber = parts[nameColumnIndex === 0 ? 1 : 0].trim().replaceAll('-', '');
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
          subtext="פעולה זאת תמחוק את כל השחקנים הקיימים ואת ההסטוריה שלה ואינה הפיכה"
          text="האם אתה בטוח?"
        />
      )}
    </>
  );
}
