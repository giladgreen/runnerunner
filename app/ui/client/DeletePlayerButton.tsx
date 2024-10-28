'use client';

import { deletePlayer } from '@/app/lib/actions';
import React, { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import AreYouSure from '@/app/ui/client/AreYouSure';

export default function DeletePlayerButton({
  id,
  userId,
}: {
  userId: string;
  id: string;
}) {
  const deletePlayerWithId = deletePlayer.bind(null, {
    id,
    prevPage: `/${userId}/players/`,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <div>
      <button
        className="rounded-md border p-2 hover:bg-gray-100"
        onClick={() => {
          setShowConfirmation(true);
        }}
      >
        <span className="sr-only">מחק</span>
        <TrashIcon className="w-5" />
      </button>
      {showConfirmation && (
        <AreYouSure
          onConfirm={() => {
            setShowConfirmation(false);
            deletePlayerWithId();
          }}
          onCancel={() => setShowConfirmation(false)}
          action="הסטוריית השחקן תימחק גם"
          question="האם אתה בטוח?"
        />
      )}
    </div>
  );
}
