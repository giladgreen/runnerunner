'use client';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/dist/client/components/navigation';
import React from 'react';
import { setPrizeAsNotReadyToBeDelivered } from '@/app/lib/actions';
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';

export default function SetPrizeAsNotReadyToBeDelivered({
  id,
}: {
  id: string;
}) {
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;

  const setPrizeAsNotReadyToBeDeliveredWithId =
    setPrizeAsNotReadyToBeDelivered.bind(null, {
      id,
      prevPage,
    });

  return (
    <div style={{ marginLeft: 10 }}>
      <button
        className="pointer rounded-md border p-2 hover:bg-gray-100 move-up-down-button"
        onClick={() => {
          setPrizeAsNotReadyToBeDeliveredWithId();
        }}
      >
        <span className="sr-only">Prize Chosen</span>
        <ArrowUpOnSquareIcon className="w-6" title="הפרס עוד לא מוכן למסירה" />
      </button>
    </div>
  );
}
