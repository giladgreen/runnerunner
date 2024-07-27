'use client';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/dist/client/components/navigation';
import React from 'react';
import { setPrizeAsReadyToBeDelivered } from '@/app/lib/actions';
import { ArrowDownOnSquareIcon } from '@heroicons/react/24/outline';

export default function SetPrizeAsReadyToBeDelivered({ id }: { id: string }) {
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;

  const setPrizeAsReadyToBeDeliveredWithId = setPrizeAsReadyToBeDelivered.bind(
    null,
    {
      id,
      prevPage,
    },
  );

  return (
    <div>
      <button
        className="pointer rounded-md border p-2 hover:bg-gray-100"
        onClick={() => {
          setPrizeAsReadyToBeDeliveredWithId();
        }}
      >
        <span className="sr-only">Prize Ready</span>
        <ArrowDownOnSquareIcon className="w-6" title="פרס מוכן למסירה" />
      </button>
    </div>
  );
}
