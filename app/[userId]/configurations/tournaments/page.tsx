import { fetchTournaments, fetchUserById } from '@/app/lib/data';
import { formatCurrency } from '@/app/lib/utils';
import React from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { TRANSLATIONS } from '@/app/lib/definitions';

export default async function TournamentsSetupPage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await fetchUserById(params.userId);
  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;
  if (!isAdmin && !isWorker) {
    return (
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl">
            <b>
              <u>אין לך הרשאות לראות עמוד זה</u>
            </b>
          </h1>
        </div>
      </div>
    );
  }
  const tournaments = await fetchTournaments();

  return (
    <div className="config-section rtl" style={{ textAlign: 'right', marginRight: -43 }}>
      <div style={{ textAlign: 'right', marginRight: 50 }}>
        <b>
          <u>טורנירים:</u>
        </b>
      </div>
      <table
        className="rtl min-w-full text-gray-900 md:table"
        style={{ textAlign: 'right' }}
      >
        <thead
          className="rounded-lg text-left text-sm font-normal"
          style={{ textAlign: 'right' }}
        >
          <tr>
            <th
              scope="col"
              className="px-4 py-5 font-medium sm:pl-6 smaller-on-mobile "
              style={{ textAlign: 'right' }}
            >
              יום
            </th>
            <th
              scope="col"
              className=" px-2 py-5 font-medium smaller-on-mobile"
              style={{ textAlign: 'right' }}
            >
              שם
            </th>
            <th
              scope="col"
              className=" px-3 py-5 font-medium smaller-on-mobile"
              style={{ textAlign: 'right' }}
            >
              עלות כניסה
            </th>
            <th
              scope="col"
              className=" px-3 py-5 font-medium smaller-on-mobile"
              style={{ textAlign: 'right' }}
            >
              עלות כניסה נוספת
            </th>
            <th
              scope="col"
              className="px-3 py-5 font-medium smaller-on-mobile"
              style={{ textAlign: 'right' }}
            >
              מספר שחקנים מירבי
            </th>
            <th
              scope="col"
              className="px-3 py-5 font-medium smaller-on-mobile"
              style={{ textAlign: 'right' }}
            >
              נדרש אישור הגעה
            </th>
            <th
              scope="col"
              className="px-3 py-5 font-medium smaller-on-mobile"
              style={{ textAlign: 'right' }}
            >
              <span className="sr-only">ערוך</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {tournaments?.map((tournament) => (
            <tr
              key={tournament.id}
              className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
            >
              <td className="cellular smaller-on-mobile whitespace-nowrap py-3 pl-6 pr-3">
                <a
                    href={`/${
                        params.userId
                    }/configurations/tournaments/${tournament.day.toLowerCase()}/edit`}
                    className="smaller-on-mobile rounded-md border p-2 hover:bg-gray-100"
                    style={{zoom:1.2, color: 'blue', border: '0 solid transparent'}}
                >
                  <b><u  >
                    {
                    // @ts-ignore
                    TRANSLATIONS[tournament.day].replace('יום', '')

                  }
                  </u></b>
                </a>
              </td>
              <td className="wide-screen smaller-on-mobile whitespace-nowrap py-3 pl-6 pr-3">
                <b className="wide-screen">
                  {
                    // @ts-ignore
                    TRANSLATIONS[tournament.day].replace('יום', '')
                  }
                </b>
              </td>
              <td className="smaller-on-mobile whitespace-nowrap px-3 py-3">
                {tournament.name}
              </td>
              <td className="smaller-on-mobile whitespace-nowrap px-3 py-3">
                {formatCurrency(tournament.buy_in)}
              </td>
              <td className="smaller-on-mobile whitespace-nowrap px-3 py-3">
                {formatCurrency(tournament.re_buy)}
              </td>
              <td className="smaller-on-mobile whitespace-nowrap px-3 py-3">
                {tournament.max_players}
              </td>
              <td className="smaller-on-mobile whitespace-nowrap px-3 py-3">
                {tournament.rsvp_required ? 'כן' : 'לא '}
              </td>
              <td className="wide-screen smaller-on-mobile whitespace-nowrap py-3 pl-6 pr-3">
                <div className="smaller-on-mobile edit-tournament-link flex justify-end gap-3">
                  <Link
                    href={`/${
                      params.userId
                    }/configurations/tournaments/${tournament.day.toLowerCase()}/edit`}
                    className="smaller-on-mobile rounded-md border p-2 hover:bg-gray-100"
                  >
                    <PencilIcon className="w-5" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
