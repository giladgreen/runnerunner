'use client';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/dist/client/components/navigation';
import React from 'react';
import { setPrizeAsNotReadyToBeDelivered } from '@/app/lib/actions';
import {
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
} from '@heroicons/react/24/outline';
import { Tooltip } from 'flowbite-react';

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
        className="pointer move-up-down-button rounded-md border p-2 hover:bg-gray-100"
        onClick={() => {
          setPrizeAsNotReadyToBeDeliveredWithId();
        }}
      >
        <Tooltip content="הפרס עוד לא מוכן למסירה" color="primary">
          <ArrowUpOnSquareIcon className="w-6" />
        </Tooltip>
      </button>
    </div>
  );
}
