import React from 'react';
import CalcCashPrizes from '@/app/ui/client/CalcCashPrizes';
import Breadcrumbs from '@/app/ui/client/Breadcrumbs';
export default async function CalcPage({
                                         params,
                                       }: {
  params: { userId: string };
}) {
  return <div>
    <Breadcrumbs
      breadcrumbs={[
        { label: '.', href: `/${params.userId}` },
        {
          label: 'הגדרות',
          href: `/${params.userId}/configurations`,
        },
        {
          label: 'חישוב פרסים במזומן',
          href: `/${params.userId}/configurations/calc`,
          active: true,
        },
      ]}
    />
    <CalcCashPrizes />
  </div> ;
}
