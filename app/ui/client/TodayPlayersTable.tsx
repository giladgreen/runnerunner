'use client';

import React, { useState } from 'react';
import { useFormStatus } from 'react-dom';

import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, nameComparator } from '@/app/lib/utils';
import RSVPButton from '@/app/ui/client/RSVPButton';
import OpenCreditModalButton from '@/app/ui/client/OpenCreditModalButton';
import { DoubleTicksIcon } from '@/app/ui/icons';
import { PlayerDB, PrizeInfoDB, TournamentDB } from '@/app/lib/definitions';
import OpenPositionModalButton from '@/app/ui/client/OpenPositionModalButton';
import OpenPrizeModalButton from '@/app/ui/client/OpenPrizeModalButton';
import EntriesButton from '@/app/ui/client/EntriesButton';
import CreateNewTodayPlayerButton from '@/app/ui/client/CreateNewTodayPlayerButton';

export default function TodayPlayersTable({
  allPlayers,
  userId,
  prizesEnabled,
  placesEnabled,
  rsvpEnabled,
  rsvpPlayersCount,
  isRsvpRequired,
  tournaments,
  prizesInformation,
}: {
  allPlayers: PlayerDB[];
  userId: string;
  prizesEnabled: boolean;
  placesEnabled: boolean;
  rsvpEnabled: boolean;
  isRsvpRequired: boolean;
  rsvpPlayersCount: number;
  tournaments: TournamentDB[];
  prizesInformation: PrizeInfoDB[];
}) {
  const getLink = (player: PlayerDB) => {
    return `/${userId}/players/${player.id}/edit`;
  };
  const playersWithEnoughCredit = allPlayers.filter((p) => p.balance > -2000);
  const [query, setQuery] = useState('');

  const players =
    query.length > 0
      ? allPlayers
          .filter(
            (p) => p.name.includes(query) || p.phone_number.includes(query),
          )
          .sort(nameComparator)
          .slice(0, 20)
      : allPlayers
          .filter((p) => p.arrived || p.rsvpForToday)
          .sort(nameComparator);

  const arrivedPlayers = allPlayers.filter((player) => player.arrived).length;
  const arrivedWithoutRSVPPlayers = allPlayers.filter(
    (player) => player.arrived && !player.rsvpForToday,
  ).length;

  const header =
    query.length > 0
      ? `showing ${players.length} search results`
      : rsvpEnabled && isRsvpRequired
      ? `Showing ${rsvpPlayersCount} players that RSVP, ${arrivedPlayers} that arrived. ${
          arrivedWithoutRSVPPlayers > 0
            ? `(${arrivedWithoutRSVPPlayers} players arrived without RSVP)`
            : ''
        }`
      : `Showing ${arrivedPlayers} players that arrived.`;

  return (
    <>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder="Search Players"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          value={query}
        />
        <CreateNewTodayPlayerButton params={{ userId }} />
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <div className="full-width mt-6 flow-root">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {header}
          </div>

          <div className="inline-block min-w-full align-middle">
            <div className="w-full rounded-lg bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {players?.map((player: PlayerDB) => (
                  <div
                    key={player.id}
                    className="full-width w-full rounded-md bg-white"
                    style={{ marginBottom: 20 }}
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <Image
                            src={player.image_url}
                            className="zoom-on-hover mr-2 rounded-full"
                            width={40}
                            height={40}
                            alt={`${player.name}'s profile picture`}
                          />
                          <div>{player.name}</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {player.phone_number}
                        </div>
                      </div>
                      {rsvpEnabled && isRsvpRequired && (
                        <div className="rsvp-icon pointer whitespace-nowrap px-3 py-3">
                          <RSVPButton player={player} setQuery={setQuery} />
                        </div>
                      )}
                    </div>

                    <div className="flex w-full items-center justify-between pt-4">
                      <div>
                        <div className="text-xl font-medium">
                          <Link href={getLink(player)}>
                            balance: {formatCurrency(player.balance)}
                          </Link>
                        </div>
                        <div className="text-l font-medium">{player.notes}</div>
                      </div>
                      <div>
                        {rsvpEnabled &&
                          player.rsvpForToday &&
                          player.arrived && <DoubleTicksIcon size={24} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Player
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Phone
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Balance
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Notes
                    </th>

                    {rsvpEnabled && isRsvpRequired && (
                      <th scope="col" className="px-3 py-5 font-medium">
                        RSVP
                      </th>
                    )}
                    <th scope="col" className="px-3 py-5 font-medium">
                      Arrived
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Buyins
                    </th>
                    {placesEnabled && (
                      <th scope="col" className="px-3 py-5 font-medium"></th>
                    )}
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {players?.map((player: PlayerDB) => (
                    <tr
                      key={player.id}
                      className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="font-large flex items-center gap-3">
                          <Image
                            src={player.image_url}
                            className="zoom-on-hover rounded-full"
                            width={40}
                            height={40}
                            alt={`${player.name}'s profile picture`}
                          />
                          <div className="font-large">{player.name}</div>
                        </div>
                      </td>
                      <td className="font-large whitespace-nowrap px-3 py-3">
                        {player.phone_number}
                      </td>
                      <td className={`whitespace-nowrap px-3 py-3 `}>
                        <Link href={getLink(player)} className="font-large">
                          {formatCurrency(player.balance)}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <Link href={getLink(player)}>{player.notes}</Link>
                      </td>

                      {rsvpEnabled && isRsvpRequired && (
                        <td className="rsvp-icon pointer whitespace-nowrap px-3 py-3">
                          <RSVPButton player={player} setQuery={setQuery} />
                        </td>
                      )}
                      <td className="rsvp-icon whitespace-nowrap px-3 py-3 ">
                        {player.arrived ? '✔️' : ''}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 ">
                        <EntriesButton player={player} />
                      </td>
                      {placesEnabled && (
                        <td className="whitespace-nowrap px-3 py-3 ">
                          {player.position && Number(player.position) > 0 ? (
                            <div
                              className="text-lg"
                              style={{
                                background: '#6666CCCC',
                                color: 'white',
                                width: 30,
                                height: 30,
                                borderRadius: 50,
                                textAlign: 'center',
                              }}
                            >
                              #{player.position}
                            </div>
                          ) : (
                            ''
                          )}
                        </td>
                      )}
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <OpenCreditModalButton
                            players={playersWithEnoughCredit}
                            player={player}
                            tournaments={tournaments}
                            userId={userId}
                            setQuery={setQuery}
                          />
                          {placesEnabled && (
                            <OpenPositionModalButton player={player} />
                          )}
                          {prizesEnabled && (
                            <OpenPrizeModalButton
                              player={player}
                              prizesInformation={prizesInformation}
                            />
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
      </div>
    </>
  );
}
