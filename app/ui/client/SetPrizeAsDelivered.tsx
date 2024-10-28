'use client';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/dist/client/components/navigation';
import React, { useState } from 'react';
import { setPrizeDelivered } from '@/app/lib/actions';
import AreYouSure from '@/app/ui/client/AreYouSure';
import { ArrowDownOnSquareIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'flowbite-react';

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
        <Tooltip content="הפרס סופק" color="primary">
          <ArrowDownOnSquareIcon className="w-6" />
        </Tooltip>
      </button>
      {showConfirmation && (
        <AreYouSure
          onConfirm={() => {
            setShowConfirmation(false);
            setPrizeDeliveredWithId();
          }}
          onCancel={() => setShowConfirmation(false)}
          action=" סימון הפרס כנמסר"
          question="האם אתה בטוח?"
        />
      )}
    </div>
  );
}
