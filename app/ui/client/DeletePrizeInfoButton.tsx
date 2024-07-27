'use client';
import { PrizeInfoDB } from '@/app/lib/definitions';
import { deletePrizeInfo } from '@/app/lib/actions';
import React, { useState } from 'react';
import AreYouSure from '@/app/ui/client/AreYouSure';

export default function DeletePrizeInfoButton({
  prize,
  userId,
}: {
  prize: PrizeInfoDB;
  userId: string;
}) {
  const deletePrizeInfoWithId = deletePrizeInfo.bind(null, {
    prizeId: prize.id,
    prevPage: `/${userId}/configurations/prizes`,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <div>
      <div
        className="pointer"
        onClick={() => {
          setShowConfirmation(true);
        }}
      >
        <button
          className="my-button delete-prize-button"
          style={{ background: 'orange' }}
        >
          מחיקה
        </button>
      </div>
      {showConfirmation && (
        <AreYouSure
          onConfirm={() => {
            setShowConfirmation(false);
            deletePrizeInfoWithId();
          }}
          onCancel={() => setShowConfirmation(false)}
          subtext=""
          text="האם למחוק פרס?"
        />
      )}
    </div>
  );
}
