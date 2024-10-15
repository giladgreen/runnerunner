'use client';
import { formatCurrency } from '@/app/lib/utils';

import { PrizeInfoDB } from '@/app/lib/definitions';
import React, { useEffect } from 'react';
import { formatDateToLocalWithTime } from '@/app/lib/serverDateUtils';
import { Button } from 'primereact/button';
import DeletePrizeInfoButton from '@/app/ui/client/DeletePrizeInfoButton';
import Link from 'next/link';

export default function PrizesTable({
  prizes,
  userId,
}: {
  userId: string;
  prizes: PrizeInfoDB[];
}) {
  const [orderBy, setOrderBy] = React.useState('created_at');
  const [orderedPrizes, setOrderedPrizes] = React.useState(prizes);

  useEffect(() => {
    const temp = [...prizes];
    temp.sort((a: PrizeInfoDB, b: PrizeInfoDB) => {
      if (orderBy === 'created_at') {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      if (orderBy === 'credit') {
        return a.credit - b.credit < 0 ? -1 : 1;
      }

      if (orderBy === 'name') {
        return a.name.localeCompare(b.name);
      }

      return -1;
    });

    setOrderedPrizes(temp);
  }, [orderBy]);

  return (
    <table className="rtl text-gray-900 md:table">
      <thead className="rtl rounded-lg text-left text-sm font-normal">
        <tr>
          <th
            scope="col"
            className=" smaller-on-mobile px-4 py-5 font-medium sm:pl-6"
            style={{ textAlign: 'right', cursor: 's-resize' }}
            onClick={() => {
              setOrderBy('name');
            }}
          >
            שם
          </th>

          <th
            scope="col"
            className=" smaller-on-mobile px-3 py-5 font-medium"
            style={{ textAlign: 'right', cursor: 's-resize' }}
            onClick={() => {
              setOrderBy('credit');
            }}
          >
            שווי בקרדיט
          </th>
          <th
            scope="col"
            className=" smaller-on-mobile px-3 py-5 font-medium"
            style={{ textAlign: 'right', cursor: 'n-resize' }}
            onClick={() => {
              setOrderBy('created_at');
            }}
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
          <th scope="col" className=" smaller-on-mobile px-3 py-5 font-medium">
            עוד מידע
          </th>
        </tr>
      </thead>
      <tbody className="rtl bg-white">
        {orderedPrizes?.map((prize) => (
          <tr
            key={prize.id}
            style={{ textAlign: 'right' }}
            className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
          >
            <td
              className=" smaller-on-mobile whitespace-nowrap py-3 pl-6 pr-3"
              style={{ textAlign: 'right' }}
            >
              <Link href={`/${userId}/configurations/prizes/${prize.id}/edit`}>
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
                href={`/${userId}/configurations/prizes/${prize.id}/edit`}
              >
                <Button className="my-button">עריכה</Button>
              </Link>
            </td>
            <td className="wide-screen smaller-on-mobile whitespace-nowrap py-3 pl-6 pr-3">
              <DeletePrizeInfoButton prize={prize} userId={userId} />
            </td>
            <td className=" smaller-on-mobile whitespace-nowrap py-3 pl-6 pr-3">
              {prize.extra}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
