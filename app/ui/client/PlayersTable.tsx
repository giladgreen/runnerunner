import Image from 'next/image';
import Sort from '@/app/ui/sort';
import UpdatePlayerButton from '@/app/ui/client/UpdatePlayerButton';
import DeletePlayerButton from '@/app/ui/client/DeletePlayerButton';
import { formatCurrency, formatCurrencyColor } from '@/app/lib/utils';
import {
  fetchFeatureFlags,
  fetchFilteredPlayers,
  fetchTournaments,
  fetchUserById,
} from '@/app/lib/data';
import Link from 'next/link';
import RSVPButton from '@/app/ui/client/RSVPButton';
import { TRANSLATIONS } from '@/app/lib/definitions';
import React from 'react';
import { formatDateToLocal, getDayOfTheWeek } from '@/app/lib/serverDateUtils';
import Avatar from '@/app/ui/client/Avatar';

export default async function PlayersTable({
  query,
  currentPage,
  sortBy,
  userId,
}: {
  query: string;
  currentPage: number;
  sortBy: string;
  userId: string;
}) {
  const user = await fetchUserById(userId);
  const isAdmin = user.is_admin;
  const { rsvpEnabled } = await fetchFeatureFlags();
  const players = await fetchFilteredPlayers(query, currentPage, sortBy);

  const dayOfTheWeek = getDayOfTheWeek();
  // @ts-ignore
  const dayOfTheWeekToShow = TRANSLATIONS[dayOfTheWeek];
  const tournaments = await fetchTournaments();

  const todayTournaments = tournaments.filter(
    (tournament) => tournament.day === dayOfTheWeek,
  );
  const isRsvpNotRequired =
    todayTournaments.length === 0 ||
    !todayTournaments.find((t) => t.rsvp_required && t.max_players > 0);

  return (
    <div className="rtl mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {players?.map((player) => (
              <div
                key={player.id}
                className="mb-2 w-full rounded-md bg-white p-4 players-page-card"
              >
                <Link href={`/${userId}/players/${player.id}/edit`}>
                  <div className="flex items-center justify-between border-b pb-4 ">
                    <div>
                      <div className="mb-2 flex items-center">
                        <Avatar
                          player={player}
                          tournamentIds={todayTournaments.map((t) => t.id)}
                        />
                        <div style={{ margin: '0 10px', zoom: 1.5 }}>
                          {player.name}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {player.phone_number}
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <div
                      className="text-xl font-medium"
                      style={{
                        color: formatCurrencyColor(player.balance),
                      }}
                    >
                      <span>קרדיט:</span>
                      <b style={{ marginRight: 5 }}>
                        {player.balance < 0 ? 'חוב של' : ''}
                      </b>
                      <b> {formatCurrency(Math.abs(player.balance))}</b>
                    </div>
                    <div className="text-l font-medium">{player.notes}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-5 font-medium sm:pl-6"
                  style={{ textAlign: 'right' }}
                >
                  <Sort text="שם השחקן" sortTerm="name" />
                </th>
                <th
                  scope="col"
                  className="font-mediu px-3 py-5 "
                  style={{ textAlign: 'right' }}
                >
                  <Sort text="טלפון" sortTerm="phone" />
                </th>
                <th
                  scope="col"
                  className="px-3 py-5 font-medium "
                  title="מיון לפי קרדיט"
                  style={{ textAlign: 'right' }}
                >
                  <Sort text="קרדיט" sortTerm="balance" />
                </th>
                <th
                  scope="col"
                  className="px-3 py-5 font-medium "
                  title="מיון לפי הערות"
                  style={{ textAlign: 'right' }}
                >
                  <Sort text="הערות" sortTerm="notes" />
                </th>
                <th
                  scope="col"
                  className="px-3 py-5 font-medium "
                  title="מיון לפי תאריך עדכון"
                  style={{ textAlign: 'right' }}
                >
                  <Sort text="תאריך עדכון" sortTerm="updated_at" />
                </th>
                {rsvpEnabled &&
                  !isRsvpNotRequired &&
                  todayTournaments
                    .filter((t) => t.rsvp_required && t.max_players > 0)
                    .map((todayTournament) => {
                      return (
                        <th
                          key={todayTournament.id}
                          scope="col"
                          className="px-3 py-5 font-medium"
                          style={{ textAlign: 'right' }}
                        >
                          <div>אישור הגעה - {dayOfTheWeekToShow}</div>
                          <div>{todayTournament.name}</div>
                        </th>
                      );
                    })}

                <th
                  scope="col"
                  className="relative py-3 pl-6 pr-3"
                  style={{ textAlign: 'right' }}
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {players?.map((player) => (
                <tr
                  key={player.id}
                  style={{ textAlign: 'right' }}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <Link href={`/${userId}/players/${player.id}/edit`}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          player={player}
                          tournamentIds={todayTournaments.map((t) => t.id)}
                        />
                        <div className="font-large">{player.name}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="font-large whitespace-nowrap px-3 py-3">
                    <Link href={`/${userId}/players/${player.id}/edit`}>
                      {player.phone_number}
                    </Link>
                  </td>
                  <td
                    className={`font-large ltr whitespace-nowrap px-3 py-3 ${
                      player.historyCount > 1 ? 'bold' : ''
                    }`}
                  >
                    <Link
                      href={`/${userId}/players/${player.id}/edit`}
                      className="font-large ltr"
                      style={{
                        color: formatCurrencyColor(player.balance),
                      }}
                    >
                      {formatCurrency(player.balance)}
                    </Link>
                  </td>
                  <td className="font-large whitespace-nowrap px-3 py-3">
                    <Link href={`/${userId}/players/${player.id}/edit`}>
                      {player.notes}
                    </Link>
                  </td>
                  <td className="font-large whitespace-nowrap px-3 py-3">
                    <Link href={`/${userId}/players/${player.id}/edit`}>
                      {formatDateToLocal(player.updated_at)}
                    </Link>
                  </td>
                  {rsvpEnabled &&
                    !isRsvpNotRequired &&
                    todayTournaments
                      .filter((t) => t.rsvp_required && t.max_players > 0)
                      .map((todayTournament) => {
                        return (
                          <td
                            key={todayTournament.id}
                            className="rsvp-icon pointer whitespace-nowrap px-3 py-3"
                          >
                            <RSVPButton
                              player={player}
                              tournamentId={todayTournament?.id!}
                            />
                          </td>
                        );
                      })}

                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdatePlayerButton id={player.id} userId={userId} />
                      {isAdmin && (
                        <DeletePlayerButton id={player.id} userId={userId} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
