'use client';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/dist/client/components/navigation';
import React, { useState } from 'react';
import { setPrizeDelivered } from '@/app/lib/actions';
import AreYouSure from '@/app/ui/client/AreYouSure';

export default function SetPrizeAsDelivered({ id }: { id: string }) {
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;
  const [showConfirmation, setShowConfirmation] = useState(false);

  const setPrizeDeliveredWithId = setPrizeDelivered.bind(null, {
    id,
    prevPage,
  });

  return (
    <div>
      <div
        className="pointer"
        onClick={() => {
          setShowConfirmation(true);
        }}
      >
        <span style={{ margin: '0 5px' }}> 👇</span>
      </div>
      {showConfirmation && (
        <AreYouSure
          onConfirm={() => {
            setShowConfirmation(false);
            setPrizeDeliveredWithId();
          }}
          onCancel={() => setShowConfirmation(false)}
          subtext="this would delete the prize from this list"
          text="Set Prize as delivered?"
        />
      )}
    </div>
  );
}
