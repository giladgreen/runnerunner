'use client';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/dist/client/components/navigation';
import React from 'react';
import { setPrizeAsReadyToBeDelivered } from '@/app/lib/actions';
import {ArrowDownOnSquareIcon, ArrowUpOnSquareIcon} from '@heroicons/react/24/outline';
import {Tooltip} from "flowbite-react";

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
    <div style={{ marginLeft: 10 }}>
      <button
        className="pointer move-up-down-button rounded-md border p-2 hover:bg-gray-100"
        onClick={() => {
          setPrizeAsReadyToBeDeliveredWithId();
        }}
      >
          <Tooltip
              content="פרס מוכן למסירה"
              color="primary"
          >
              <ArrowDownOnSquareIcon className="w-6" />
          </Tooltip>

      </button>
    </div>
  );
}
