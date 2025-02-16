'use client';
import React from 'react';
import { createPrizeInfo } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { PencilIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import SpinnerButton from '@/app/ui/client/SpinnerButton';
import Breadcrumbs from '@/app/ui/client/Breadcrumbs';
import { CreatePrizeForm } from '@/app/ui/client/CreatePrizeForm';

export default function CreateNewPrizesInfoPage({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = params;
  const prevPage = `/${userId}/configurations/prizes`;

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: '.', href: `/${params.userId}` },
          {
            label: 'הגדרות',
            href: `/${params.userId}/configurations`,
          },
          {
            label: 'פרסים',
            href: `/${params.userId}/configurations/prizes`,
          },
          {
            label: 'יצירת פרס חדש',
            href: `/${params.userId}/configurations/prizes/create`,
            active: true,
          },
        ]}
      />

      <CreatePrizeForm prevPage={prevPage}/>
    </div>
  );
}
