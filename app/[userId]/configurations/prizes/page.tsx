import { lusitana } from '@/app/ui/fonts';
import { fetchPrizesInfo, fetchUserById } from '@/app/lib/data';
import React from 'react';
import { formatCurrency, formatDateToLocalWithTime } from '@/app/lib/utils';
import Link from 'next/link';
import { Button } from 'primereact/button';
import DeletePrizeInfoButton from '@/app/ui/client/DeletePrizeInfoButton';
import Breadcrumbs from "@/app/ui/client/Breadcrumbs";

export default async function PrizesInfoPage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await fetchUserById(params.userId);
  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;

  const prizes = await fetchPrizesInfo();
  if (!isAdmin && !isWorker) {
    return (
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl`}>
            <b>
              <u>אין לך הרשאות לראות עמוד זה</u>
            </b>
          </h1>
        </div>
      </div>
    );
  }

  const prizesCount = prizes.length;
  return (
    <div className="w-full rtl">
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
          ]}
      />


      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          <b>
            <u>
              {prizesCount === 0
                ? 'אין עוד מידע על פרסים'
                : `פרסים (${prizesCount})`}
            </u>
          </b>
        </h1>
      </div>
      <div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Link href={`/${params.userId}/configurations/prizes/create`}>
            <Button className="my-button">הכנס פרטי פרס חדש</Button>
          </Link>
        </div>
      </div>
      {prizesCount > 0 && (
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8 rtl">
          <table className="hidden  text-gray-900 md:table rtl">
            <thead className="rounded-lg text-left text-sm font-normal rtl">
              <tr>
                <th scope="col" className=" px-4 py-5 font-medium sm:pl-6" style={{ textAlign: 'right' }}>
                  שם
                </th>

                <th scope="col" className=" px-3 py-5 font-medium" style={{ textAlign: 'right' }}>
                  שווי בקרדיט
                </th>
                <th scope="col" className=" px-3 py-5 font-medium" style={{ textAlign: 'right' }}>
                  תאריך עדכון
                </th>
                <th scope="col" className=" px-3 py-5 font-medium"></th>
                <th scope="col" className=" px-3 py-5 font-medium"></th>
                <th scope="col" className=" px-3 py-5 font-medium">
                  עוד מידע
                </th>
              </tr>
            </thead>
            <tbody className="bg-white rtl">
              {prizes?.map((prize) => (
                <tr
                  key={prize.id}
                  style={{ textAlign: 'right' }}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className=" whitespace-nowrap py-3 pl-6 pr-3" style={{ textAlign: 'right' }}>
                    {prize.name}
                  </td>

                  <td className=" whitespace-nowrap py-3 pl-6 pr-3" style={{ textAlign: 'right' }}>
                    {formatCurrency(prize.credit)}
                  </td>
                  <td className=" whitespace-nowrap py-3 pl-6 pr-3" style={{ textAlign: 'right' }}>
                    {formatDateToLocalWithTime(prize.created_at)}
                  </td>
                  <td className=" whitespace-nowrap py-3 pl-6 pr-3">
                    <Link
                      href={`/${params.userId}/configurations/prizes/${prize.id}/edit`}
                    >
                      <Button className="my-button">עריכה</Button>
                    </Link>
                  </td>
                  <td className=" whitespace-nowrap py-3 pl-6 pr-3">
                    <DeletePrizeInfoButton
                      prize={prize}
                      userId={params.userId}
                    />
                  </td>
                  <td className=" whitespace-nowrap py-3 pl-6 pr-3">
                    {prize.extra}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
