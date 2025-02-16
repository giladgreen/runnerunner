'use client';
import { PrizeInfoDB } from '@/app/lib/definitions';
import { deletePrizeInfo } from '@/app/lib/actions';
import React, { useState } from 'react';
import AreYouSure from '@/app/ui/client/AreYouSure';
import { Tooltip } from 'flowbite-react';
import { Button } from 'primereact/button';

export default function DeletePrizeInfoButton({
  prize,
  userId,
  text = 'מחיקה',
}: {
  prize: PrizeInfoDB;
  userId: string;
  text?: string;
}) {
  const deletePrizeInfoWithId = deletePrizeInfo.bind(null, {
    prizeId: prize.id,
    prevPage: `/${userId}/configurations/prizes`,
    userId,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);


  return (
    <div>
      <button
        className="pointer rounded-md  p-2 "
        onClick={() => {
          setShowConfirmation(true);
        }}
      >
        <Tooltip content="מחק פרס" color="primary">

          <Button className="my-button delete-prize-button">
            {text}
            </Button>

        </Tooltip>
      </button>
      {showConfirmation && (
        <AreYouSure
          onConfirm={() => {
            setShowConfirmation(false);
            deletePrizeInfoWithId();
          }}
          onCancel={() => setShowConfirmation(false)}
          action="מחיקת הפרס"
          question="האם אתה בטוח?"
        />
      )}
    </div>
  );
}
