'use client';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/dist/client/components/navigation';
import React, { useState } from 'react';
import { setPrizeDelivered } from '@/app/lib/actions';
import AreYouSure from '@/app/ui/client/AreYouSure';
import { ArrowDownOnSquareIcon } from '@heroicons/react/24/outline';

export default function SetPrizeAsDelivered({ id }: { id: string }) {
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;
  const [showConfirmation, setShowConfirmation] = useState(false);

  const setPrizeDeliveredWithId = setPrizeDelivered.bind(null, {
    id,
    prevPage,
  });

  return (
    <div style={{ marginLeft: 10 }}>
      <button
        className="pointer move-up-down-button rounded-md border p-2 hover:bg-gray-100"
        onClick={() => {
          setShowConfirmation(true);
        }}
      >
        <span className="sr-only">Prize Ready</span>
        <ArrowDownOnSquareIcon className="w-6" title="פרס סופק" />
      </button>
      {showConfirmation && (
        <AreYouSure
          onConfirm={() => {
            setShowConfirmation(false);
            setPrizeDeliveredWithId();
          }}
          onCancel={() => setShowConfirmation(false)}
          subtext=""
          text="האם הפרס נמסר?"
        />
      )}
    </div>
  );
}
