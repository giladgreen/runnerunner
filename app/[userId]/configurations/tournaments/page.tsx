import { fetchTournaments, fetchUserById } from '@/app/lib/data';
import { formatCurrency } from '@/app/lib/utils';
import React from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { TRANSLATIONS } from '@/app/lib/definitions';
import DeleteTournamentButton from '@/app/ui/client/DeleteTournamentButton';
import { Button } from 'primereact/button';
import NoPermissionsPage from '@/app/ui/client/NoPermissionsPage';
import Breadcrumbs from '@/app/ui/client/Breadcrumbs';
import OpenTournamentEditModalButton from '@/app/ui/client/OpenTournamentEditModalButton';

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
      className="config-section tournaments-config rtl"
      style={{ textAlign: 'right', marginRight: -40 }}
    >
      <Breadcrumbs
        breadcrumbs={[
          { label: '.', href: `/${params.userId}` },
          {
            label: 'הגדרות',
            href: `/${params.userId}/configurations`,
          },
          {
            label: 'טורנירים',
            href: `/${params.userId}/configurations/tournaments`,
            active: true,
          },
        ]}
      />

      <div style={{ textAlign: 'right', marginRight: 50 }}>
        <b>
          <u>טורנירים:</u>
        </b>
      </div>

      {/*mobile view*/}
      <div className="cellular tournaments-config-mobile-items">
        {tournaments?.map((tournament, index) => (
          <div key={tournament.id} className={`item`}>
            <a
              href={`/${params.userId}/configurations/tournaments/${tournament.id}/edit`}
              className="smaller-on-mobile rounded-md border p-2"
              style={{
                zoom: 1.7,
                border: '0 solid transparent',
              }}
            >
              <div>
                <b>
                  <u>{tournament.name}</u>
                </b>
              </div>
              <div> {tournament.description}</div>

            </a>

            <b>
              {
                // @ts-ignore
                TRANSLATIONS[tournament.day]
              }
            </b>
            <div>
              כניסה ראשונה:
              {tournament.rsvp_required && tournament.max_players === 0
                ? '--'
                : formatCurrency(tournament.buy_in)}
            </div>
            <div>
              כניסה נוספת:
              {tournament.rsvp_required && tournament.max_players === 0
                ? '--'
                : formatCurrency(tournament.re_buy)}
            </div>
            <div>
              ערימה התחלתית:
              {tournament.rsvp_required && tournament.max_players === 0
                ? '--'
                : tournament.initial_stack.toLocaleString()}
            </div>
            <div>
              אורך שלב:
              {tournament.rsvp_required && tournament.max_players === 0
                ? '--'
                : tournament.phase_length}
            </div>
            <div>
              שלה אחרון לכניסות:
              {tournament.rsvp_required && tournament.max_players === 0
                ? '--'
                : tournament.last_phase_for_rebuy}
            </div>
            <div>
              מספר מקסימלי של שחקנים:
              {tournament.rsvp_required && tournament.max_players === 0
                ? '--'
                : tournament.max_players}
            </div>
            <div>
              חייב ברישום:
              {tournament.rsvp_required && tournament.max_players === 0
                ? '--'
                : tournament.rsvp_required
                  ? 'כן'
                  : 'לא '}
            </div>

            <div
              className="flex justify-end gap-3"
              style={{ marginTop: -10, marginBottom: 10, marginLeft: 10 }}
            >
              {tournament.day_has_more_then_one && (
                <div
                  style={{
                    border: '1px solid white',
                    borderRadius: 5,
                    padding: 0,
                  }}
                >
                  <DeleteTournamentButton
                    tournamentId={tournament.id}
                    userId={params.userId}
                  />
                </div>
              )}
              <Link
                href={`/${params.userId}/configurations/tournaments/${tournament.id}/edit`}
                className=" rounded-md border p-2 "
              >
                <PencilIcon className="w-5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/*web view*/}
      <table className="rtl align-text-right  hide-on-mobile min-w-full md:table">
        <thead className="align-text-right rounded-lg  text-left font-normal">
          <tr>
            <th
              scope="col"
              className="align-text-right px-4 py-5 font-medium sm:pl-6"
            >
              יום
            </th>
            <th
              scope="col"
              className="align-text-right px-4 py-5 font-medium sm:pl-6"
            >
              שעה
            </th>
            <th scope="col" className=" align-text-right px-2 py-5 font-medium">
              שם
            </th>
            <th scope="col" className=" align-text-right px-2 py-5 font-medium">
              תיאור
            </th>
            <th scope="col" className=" align-text-right px-3 py-5 font-medium">
              עלות כניסה
            </th>
            <th scope="col" className=" align-text-right px-3 py-5 font-medium">
              עלות כניסה נוספת
            </th>
            <th scope="col" className=" align-text-right px-3 py-5 font-medium">
              ערימה התחלתית
            </th>
            <th scope="col" className=" align-text-right px-3 py-5 font-medium">
              אורך שלב
            </th>
            <th scope="col" className=" align-text-right px-3 py-5 font-medium">
              מספר שלבים שניתן לבצע כניסה מחדש
            </th>
            <th scope="col" className=" align-text-right px-3 py-5 font-medium">
              מספר שחקנים מירבי
            </th>
            <th scope="col" className=" align-text-right px-3 py-5 font-medium">
              נדרש אישור הגעה
            </th>
            <th scope="col" className=" align-text-right px-3 py-5 font-medium">
              <span className="sr-only">ערוך</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tournaments?.map((tournament, index) => (
            <tr
              key={tournament.id}
              className={`table-row-background-color${(index % 2) + 1}. w-full border-b py-3  last-of-type:border-none `}
            >
              <td className="cellular whitespace-nowrap py-3 pl-6 pr-3">
                <a
                  href={`/${params.userId}/configurations/tournaments/${tournament.id}/edit`}
                  className=" rounded-md border p-2"
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
              <td className="wide-screen whitespace-nowrap py-3 pl-6 pr-3">
                <b>
                  {
                    // @ts-ignore
                    TRANSLATIONS[tournament.day].replace('יום', '')
                  }
                </b>
              </td>
              <td className="whitespace-nowrap px-3 py-3">
                {tournament.rsvp_required && tournament.max_players === 0
                  ? '--'
                  : tournament.start_time}
              </td>
              <td className="whitespace-nowrap px-3 py-3">
                {tournament.rsvp_required && tournament.max_players === 0
                  ? '--'
                  : tournament.name}
              </td>
              <td className="whitespace-nowrap px-3 py-3">
                {tournament.rsvp_required && tournament.max_players === 0
                  ? '--'
                  : tournament.description}
              </td>
              <td className="whitespace-nowrap px-3 py-3">
                {tournament.rsvp_required && tournament.max_players === 0
                  ? '--'
                  : formatCurrency(tournament.buy_in)}
              </td>
              <td className="whitespace-nowrap px-3 py-3">
                {tournament.rsvp_required && tournament.max_players === 0
                  ? '--'
                  : formatCurrency(tournament.re_buy)}
              </td>
              <td className="whitespace-nowrap px-3 py-3">
                {tournament.rsvp_required && tournament.max_players === 0
                  ? '--'
                  : tournament.initial_stack.toLocaleString()}
              </td>
              <td className="whitespace-nowrap px-3 py-3">
                {tournament.rsvp_required && tournament.max_players === 0
                  ? '--'
                  : tournament.phase_length}
              </td>
              <td className="whitespace-nowrap px-3 py-3">
                {tournament.rsvp_required && tournament.max_players === 0
                  ? '--'
                  : tournament.last_phase_for_rebuy}
              </td>
              <td className="whitespace-nowrap px-3 py-3">
                {tournament.rsvp_required && tournament.max_players === 0
                  ? '--'
                  : tournament.max_players}
              </td>
              <td className="whitespace-nowrap px-3 py-3">
                {tournament.rsvp_required && tournament.max_players === 0
                  ? '--'
                  : tournament.rsvp_required
                    ? 'כן'
                    : 'לא '}
              </td>
              <td className="wide-screen whitespace-nowrap py-3 pl-6 pr-3">
                <div className=" edit-tournament-link flex justify-end gap-3">
                  <Link
                    href={`/${params.userId}/configurations/tournaments/${tournament.id}/edit`}
                    className="cellular rounded-md border p-2 "
                  >
                    <PencilIcon className="w-5" />
                  </Link>
                  <div className="hide-on-mobile">
                    <OpenTournamentEditModalButton userId={params.userId} tournament={tournament}/>
                  </div>


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
      <div
        style={{
          textAlign: 'right',
          marginTop: 150,
          marginRight: 50,
          marginBottom: 20,
        }}
      >
        <Link href={`/${params.userId}/configurations/tournaments/create`}>
          <Button className="my-button">צור טורניר חדש</Button>
        </Link>
      </div>
    </div>
  );
}
