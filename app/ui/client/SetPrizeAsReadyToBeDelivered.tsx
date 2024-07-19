'use client';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/dist/client/components/navigation';
import React from 'react';
import { setPrizeAsReadyToBeDelivered } from '@/app/lib/actions';

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
      <div
        className="pointer"
        onClick={() => {
          setPrizeAsReadyToBeDeliveredWithId();
        }}
      >
        <span style={{ margin: '0 5px' }}> 👇🏻</span>
      </div>
    </div>
  );
}
