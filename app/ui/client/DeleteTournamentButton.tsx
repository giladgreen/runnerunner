'use client';
import { deleteTournament } from '@/app/lib/actions';
import React, { useState } from 'react';
import AreYouSure from '@/app/ui/client/AreYouSure';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function DeleteTournamentButton({
  tournamentId,
  userId,
}: {
  tournamentId: string;
  userId: string;
}) {
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
          style={{ padding: 8, background: 'white' }}
        >
          <TrashIcon className="w-5" />
        </button>
      </div>
      {showConfirmation && (
        <AreYouSure
          onConfirm={() => {
            setShowConfirmation(false);
            deleteTournament(
              tournamentId,
              `/${userId}/configurations/tournaments`,
              userId,
            );
          }}
          onCancel={() => setShowConfirmation(false)}
          subtext=""
          text="האם למחוק טורניר?"
        />
      )}
    </div>
  );
}
