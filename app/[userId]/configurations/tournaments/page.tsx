import { fetchTournaments, fetchUserById } from '@/app/lib/data';
import { formatCurrency } from '@/app/lib/utils';
import React from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { TRANSLATIONS } from '@/app/lib/definitions';
import DeleteTournamentButton from '@/app/ui/client/DeleteTournamentButton';
import { Button } from 'primereact/button';
import NoPermissionsPage from '@/app/ui/client/NoPermissionsPage';

export default async function TournamentsSetupPage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await fetchUserById(params.userId);
  const isAdmin = user.is_admin;
  const isWorker = user.is_worker;
  if (!isAdmin && !isWorker) {
    return <NoPermissionsPage />;
  }
  const tournaments = await fetchTournaments();

  return (
    <div
      className="config-section rtl"
      style={{ textAlign: 'right', marginRight: -40 }}
    >
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
              className="smaller-on-mobile px-4 py-5 font-medium sm:pl-6 "
              style={{ textAlign: 'right' }}
            >
              יום
            </th>
            <th
              scope="col"
              className="smaller-on-mobile px-4 py-5 font-medium sm:pl-6 "
              style={{ textAlign: 'right' }}
            >
              שעה
            </th>
            <th
              scope="col"
              className=" smaller-on-mobile px-2 py-5 font-medium"
              style={{ textAlign: 'right' }}
            >
              שם
            </th>
            <th
              scope="col"
              className=" smaller-on-mobile px-3 py-5 font-medium"
              style={{ textAlign: 'right' }}
            >
              עלות כניסה
            </th>
            <th
              scope="col"
              className=" smaller-on-mobile px-3 py-5 font-medium"
              style={{ textAlign: 'right' }}
            >
              עלות כניסה נוספת
            </th>
            <th
              scope="col"
              className=" smaller-on-mobile px-3 py-5 font-medium"
              style={{ textAlign: 'right' }}
            >
              ערימה התחלתית
            </th>
            <th
              scope="col"
              className=" smaller-on-mobile px-3 py-5 font-medium"
              style={{ textAlign: 'right' }}
            >
              אורך שלב
            </th>
            <th
              scope="col"
              className=" smaller-on-mobile px-3 py-5 font-medium"
              style={{ textAlign: 'right' }}
            >
              מספר שלבים שניתן לבצע כניסה מחדש
            </th>
            <th
              scope="col"
              className="smaller-on-mobile px-3 py-5 font-medium"
              style={{ textAlign: 'right' }}
            >
              מספר שחקנים מירבי
            </th>
            <th
              scope="col"
              className="smaller-on-mobile px-3 py-5 font-medium"
              style={{ textAlign: 'right' }}
            >
              נדרש אישור הגעה
            </th>
            <th
              scope="col"
              className="smaller-on-mobile px-3 py-5 font-medium"
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
                  href={`/${params.userId}/configurations/tournaments/${tournament.id}/edit`}
                  className="smaller-on-mobile rounded-md border p-2 hover:bg-gray-100"
                  style={{
                    zoom: 1.2,
                    color: 'blue',
                    border: '0 solid transparent',
                  }}
                >
                  <b>
                    <u>
                      {
                        // @ts-ignore
                        TRANSLATIONS[tournament.day].replace('יום', '')
                      }
                    </u>
                  </b>
                </a>
              </td>
              <td className="wide-screen smaller-on-mobile whitespace-nowrap py-3 pl-6 pr-3">
                <b>
                  {
                    // @ts-ignore
                    TRANSLATIONS[tournament.day].replace('יום', '')
                  }
                </b>
              </td>
              <td className="smaller-on-mobile whitespace-nowrap px-3 py-3">
                {tournament.rsvp_required && tournament.max_players === 0
                  ? '--'
                  : tournament.start_time}
              </td>
              <td className="smaller-on-mobile whitespace-nowrap px-3 py-3">
                {tournament.rsvp_required && tournament.max_players === 0
                  ? '--'
                  : tournament.name}
              </td>
              <td className="smaller-on-mobile whitespace-nowrap px-3 py-3">
                {tournament.rsvp_required && tournament.max_players === 0
                  ? '--'
                  : formatCurrency(tournament.buy_in)}
              </td>
              <td className="smaller-on-mobile whitespace-nowrap px-3 py-3">
                {tournament.rsvp_required && tournament.max_players === 0
                  ? '--'
                  : formatCurrency(tournament.re_buy)}
              </td>
              <td className="smaller-on-mobile whitespace-nowrap px-3 py-3">
                {tournament.rsvp_required && tournament.max_players === 0
                  ? '--'
                  : tournament.initial_stack.toLocaleString()}
              </td>
              <td className="smaller-on-mobile whitespace-nowrap px-3 py-3">
                {tournament.rsvp_required && tournament.max_players === 0
                  ? '--'
                  : tournament.phase_length}
              </td>
              <td className="smaller-on-mobile whitespace-nowrap px-3 py-3">
                {tournament.rsvp_required && tournament.max_players === 0
                  ? '--'
                  : tournament.last_phase_for_rebuy}
              </td>
              <td className="smaller-on-mobile whitespace-nowrap px-3 py-3">
                {tournament.rsvp_required && tournament.max_players === 0
                  ? '--'
                  : tournament.max_players}
              </td>
              <td className="smaller-on-mobile whitespace-nowrap px-3 py-3">
                {tournament.rsvp_required && tournament.max_players === 0
                  ? '--'
                  : tournament.rsvp_required
                    ? 'כן'
                    : 'לא '}
              </td>
              <td className="wide-screen smaller-on-mobile whitespace-nowrap py-3 pl-6 pr-3">
                <div className="smaller-on-mobile edit-tournament-link flex justify-end gap-3">
                  <Link
                    href={`/${params.userId}/configurations/tournaments/${tournament.id}/edit`}
                    className="smaller-on-mobile rounded-md border p-2 hover:bg-gray-100"
                  >
                    <PencilIcon className="w-5" />
                  </Link>
                  {tournament.day_has_more_then_one && (
                    <DeleteTournamentButton
                      tournamentId={tournament.id}
                      userId={params.userId}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: 'right', marginTop: 150 }}>
        <Link href={`/${params.userId}/configurations/tournaments/create`}>
          <Button className="my-button">צור טורניר חדש</Button>
        </Link>
      </div>
    </div>
  );
}
