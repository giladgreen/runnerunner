'use client';

import { deleteBug } from '@/app/lib/actions';
import React, { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import AreYouSure from '@/app/ui/client/AreYouSure';

export default function DeleteBugButton({
  id,
  userId,
}: {
  userId: string;
  id: string;
}) {
  const deleteBugWithId = deleteBug.bind(null, {
    id,
    prevPage: `/${userId}/configurations/`,
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
              deleteBugWithId();
          }}
          onCancel={() => setShowConfirmation(false)}
          subtext=""
          text="האם למחוק את באג?"
        />
      )}
    </div>
  );
}
