import { lusitana } from '@/app/ui/fonts';
import { fetchPrizesInfo, fetchUserById } from '@/app/lib/data';
import React from 'react';
import { formatCurrency } from '@/app/lib/utils';
import Link from 'next/link';
import { Button } from 'primereact/button';
import DeletePrizeInfoButton from '@/app/ui/client/DeletePrizeInfoButton';
import Breadcrumbs from '@/app/ui/client/Breadcrumbs';
import NoPermissionsPage from '@/app/ui/client/NoPermissionsPage';
import { formatDateToLocalWithTime } from '@/app/lib/serverDateUtils';

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
    return <NoPermissionsPage />;
  }

  const prizesCount = prizes.length;
  return (
    <div className="rtl w-full">
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
        <div className="rtl mt-4 flex items-center justify-between gap-2 md:mt-8">
          <table className="rtl text-gray-900 md:table">
            <thead className="rtl rounded-lg text-left text-sm font-normal">
              <tr>
                <th
                  scope="col"
                  className=" smaller-on-mobile px-4 py-5 font-medium sm:pl-6"
                  style={{ textAlign: 'right' }}
                >
                  שם
                </th>

                <th
                  scope="col"
                  className=" smaller-on-mobile px-3 py-5 font-medium"
                  style={{ textAlign: 'right' }}
                >
                  שווי בקרדיט
                </th>
                <th
                  scope="col"
                  className=" smaller-on-mobile px-3 py-5 font-medium"
                  style={{ textAlign: 'right' }}
                >
                  תאריך עדכון
                </th>
                <th
                  scope="col"
                  className=" smaller-on-mobile px-3 py-5 font-medium"
                ></th>
                <th
                  scope="col"
                  className=" smaller-on-mobile px-3 py-5 font-medium"
                ></th>
                <th
                  scope="col"
                  className=" smaller-on-mobile px-3 py-5 font-medium"
                >
                  עוד מידע
                </th>
              </tr>
            </thead>
            <tbody className="rtl bg-white">
              {prizes?.map((prize) => (
                <tr
                  key={prize.id}
                  style={{ textAlign: 'right' }}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td
                    className=" smaller-on-mobile whitespace-nowrap py-3 pl-6 pr-3"
                    style={{ textAlign: 'right' }}
                  >
                    <Link
                      href={`/${params.userId}/configurations/prizes/${prize.id}/edit`}
                    >
                      <b>
                        <u className="cellular" style={{ color: 'blue' }}>
                          {prize.name}
                        </u>
                      </b>
                      <b className="wide-screen">{prize.name}</b>
                    </Link>
                  </td>

                  <td
                    className=" smaller-on-mobile whitespace-nowrap py-3 pl-6 pr-3"
                    style={{ textAlign: 'right' }}
                  >
                    {formatCurrency(prize.credit)}
                  </td>
                  <td
                    className=" smaller-on-mobile whitespace-nowrap py-3 pl-6 pr-3"
                    style={{ textAlign: 'right' }}
                  >
                    {formatDateToLocalWithTime(prize.created_at)}
                  </td>
                  <td className="smaller-on-mobile whitespace-nowrap py-3 pl-6 pr-3">
                    <Link
                      className="wide-screen edit-prize-link"
                      href={`/${params.userId}/configurations/prizes/${prize.id}/edit`}
                    >
                      <Button className="my-button">עריכה</Button>
                    </Link>
                  </td>
                  <td className="wide-screen smaller-on-mobile whitespace-nowrap py-3 pl-6 pr-3">
                    <DeletePrizeInfoButton
                      prize={prize}
                      userId={params.userId}
                    />
                  </td>
                  <td className=" smaller-on-mobile whitespace-nowrap py-3 pl-6 pr-3">
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
