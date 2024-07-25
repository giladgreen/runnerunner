import { lusitana } from '@/app/ui/fonts';
import { fetchPrizesInfo, fetchUserById } from '@/app/lib/data';
import React from 'react';
import { formatCurrency, formatDateToLocalWithTime } from '@/app/lib/utils';
import Link from 'next/link';
import { Button } from 'primereact/button';
import DeletePrizeInfoButton from '@/app/ui/client/DeletePrizeInfoButton';

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
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          <b>
            <u>
              {prizesCount === 0
                ? 'No prizes information yet'
                : `Prizes information (${prizesCount})`}
            </u>
          </b>
        </h1>
      </div>
      <div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Link href={`/${params.userId}/configurations/prizes/create`}>
            <Button className="my-button">Create New Prize</Button>
          </Link>
        </div>
      </div>
      {prizesCount > 0 && (
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <table className="hidden  text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className=" px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>

                <th scope="col" className=" px-3 py-5 font-medium">
                  Credit worth
                </th>
                <th scope="col" className=" px-3 py-5 font-medium">
                  Updated at
                </th>
                <th scope="col" className=" px-3 py-5 font-medium"></th>
                <th scope="col" className=" px-3 py-5 font-medium"></th>
                <th scope="col" className=" px-3 py-5 font-medium">
                  Extra
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {prizes?.map((prize) => (
                <tr
                  key={prize.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className=" whitespace-nowrap py-3 pl-6 pr-3">
                    {prize.name}
                  </td>

                  <td className=" whitespace-nowrap py-3 pl-6 pr-3">
                    {formatCurrency(prize.credit)}
                  </td>
                  <td className=" whitespace-nowrap py-3 pl-6 pr-3">
                    {formatDateToLocalWithTime(prize.created_at)}
                  </td>
                  <td className=" whitespace-nowrap py-3 pl-6 pr-3">
                    <Link
                      href={`/${params.userId}/configurations/prizes/${prize.id}/edit`}
                    >
                      {' '}
                      <Button className="my-button">Edit</Button>
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
