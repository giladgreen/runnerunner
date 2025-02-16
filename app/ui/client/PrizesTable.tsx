'use client';
import { formatCurrency } from '@/app/lib/utils';

import { PrizeInfoDB } from '@/app/lib/definitions';
import React, { useEffect } from 'react';
import { formatDateToLocalWithTime } from '@/app/lib/serverDateUtils';
import DeletePrizeInfoButton from '@/app/ui/client/DeletePrizeInfoButton';
import Link from 'next/link';
import OpenEditPrizeModalButton from '@/app/ui/client/OpenEditPrizeModalButton';

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
  }, [orderBy, prizes]);

  return (
    <table className="rtl md:table prizes-table">
      <thead className="rtl rounded-lg text-left  font-normal">
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
      <tbody className="rtl ">
        {orderedPrizes?.map((prize) => (
          <tr
            key={prize.id}

            className="align-text-right w-full border-b py-3  last-of-type:border-none "
          >
            <td
              className="align-text-right smaller-on-mobile whitespace-nowrap py-3 pl-6 pr-3"

            >
              <Link href={`/${userId}/configurations/prizes/${prize.id}/edit`}>
                <b>
                  <u className="cellular link-color" >
                    {prize.name}
                  </u>
                </b>
                <b className="wide-screen">{prize.name}</b>
              </Link>
            </td>

            <td
              className="align-text-right smaller-on-mobile whitespace-nowrap py-3 pl-6 pr-3"

            >
              {formatCurrency(prize.credit)}
            </td>
            <td
              className="align-text-right smaller-on-mobile-smaller whitespace-nowrap py-3 pl-6 pr-3"

            >
              {formatDateToLocalWithTime(prize.created_at)}
            </td>
            <td className=" whitespace-nowrap py-3 pl-6 pr-3">
              <OpenEditPrizeModalButton prize={prize} prizes={prizes} userId={userId} />
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
