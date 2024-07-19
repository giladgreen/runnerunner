'use client';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/dist/client/components/navigation';
import React from 'react';
import { setPrizeAsNotReadyToBeDelivered } from '@/app/lib/actions';

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
    <div>
      <div
        className="pointer"
        onClick={() => {
          setPrizeAsNotReadyToBeDeliveredWithId();
        }}
      >
        <span style={{ margin: '0 5px' }}> 👆</span>
      </div>
    </div>
  );
}
