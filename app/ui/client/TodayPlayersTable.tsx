'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  formatCurrency,
  formatCurrencyColor,
} from '@/app/lib/utils';
import RSVPButton from '@/app/ui/client/RSVPButton';
import OpenCreditModalButton from '@/app/ui/client/OpenCreditModalButton';
import { Tooltip  } from 'flowbite-react';
import { PlayerDB, PrizeInfoDB, TournamentDB } from '@/app/lib/definitions';
import OpenPositionModalButton from '@/app/ui/client/OpenPositionModalButton';
import OpenPrizeModalButton from '@/app/ui/client/OpenPrizeModalButton';
import EntriesButton from '@/app/ui/client/EntriesButton';
import CreateNewTodayPlayerButton from '@/app/ui/client/CreateNewTodayPlayerButton';
import { TrashIcon } from '@heroicons/react/24/outline';
import { usePathname, useSearchParams } from 'next/navigation';
import DeletePositionButton from '@/app/ui/client/DeletePositionButton';
import { getDayOfTheWeek } from '@/app/lib/clientDateUtils';
import Avatar from '@/app/ui/client/Avatar';
import AutoPlayerPayButton from '@/app/ui/client/AutoPlayerPayButton';

function getMinPosition(players: PlayerDB[]) {
  const positions = players
    .filter((p) => !isNaN(p.position) && p.position > 0)
    .map((p) => p.position);

  if (positions.length > 0) {
    return Math.min(...positions) - 1;
  }

  if (players.length > 200) {
    return 14;
  }

  if (players.length > 170) {
    return 13;
  }

  if (players.length > 150) {
    return 12;
  }

  if (players.length > 130) {
    return 12;
  }

  if (players.length > 110) {
    return 11;
  }

  if (players.length > 90) {
    return 10;
  }

  if (players.length > 10) {
    return 9;
  }

  return players.length;
}

export default function TodayPlayersTable({
  allPlayers,
  userId,
  rsvpEnabled,
  rsvpPlayersCount,
  isRsvpRequired,
  tournaments,
  prizesInformation,
  tournamentId,
  prizesEnabled,
}: {
  allPlayers: PlayerDB[];
  userId: string;
  prizesEnabled: boolean;
  rsvpEnabled: boolean;
  isRsvpRequired: boolean;
  rsvpPlayersCount: number;
  tournaments: TournamentDB[];
  prizesInformation: PrizeInfoDB[];
  tournamentId: string;
}) {
  const prevPage = `${usePathname()}?${useSearchParams().toString()}`;

  const getLink = (player: PlayerDB) => {
    return `/${userId}/players/${player.id}/edit`;
  };
  const playersWithEnoughCredit = allPlayers.filter((p) => p.balance > -2000);
  const [query, setQuery] = useState('');
  const now = new Date().getTime();
  const fiveMinutesAgo = now - 5 * 60 * 1000;

  // @ts-ignore
  allPlayers.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  const getFilteredPlayers = (playerToFilter: PlayerDB[]) =>
    query.length > 0
      ? playerToFilter
          .filter(
            (p) =>
              (isNaN(Number(query)) && p.name.includes(query)) ||
              (!isNaN(Number(query)) && p.phone_number.includes(query)),
          )
          .slice(0, 20)
      : playerToFilter.filter((p) => {
          if (p.arrived === tournamentId) {
            return true;
          }
          if (p.rsvpForToday === tournamentId) {
            return true;
          }
          // @ts-ignore
          return new Date(p.updated_at).getTime() > fiveMinutesAgo;
        });

  const [players, setPlayers] = useState<PlayerDB[]>(
    getFilteredPlayers(allPlayers),
  );

  const updatePlayer = (playerToUpdate: PlayerDB) => {
    setPlayers((prevPlayers) => {
      const exisingPlayer = prevPlayers.find((p) => p.id === playerToUpdate.id);
      if (!exisingPlayer) {
        return prevPlayers;
      }
      const newPlayersArray = [
        playerToUpdate,
        ...prevPlayers.filter((p) => p.id !== playerToUpdate.id),
      ];
      return getFilteredPlayers(newPlayersArray);
    });
  };

  useEffect(() => {
    setPlayers(getFilteredPlayers(allPlayers));
  }, [query, allPlayers]);

  const arrivedPlayers = allPlayers.filter(
    (player) => player.arrived === tournamentId,
  ).length;
  const arrivedWithoutRSVPPlayers = allPlayers.filter(
    (player) =>
      player.arrived === tournamentId && player.rsvpForToday !== tournamentId,
  ).length;

  const header =
    query.length > 0
      ? `מציג ${players.length} תוצאות `
      : rsvpEnabled && isRsvpRequired
        ? `מציג  ${rsvpPlayersCount} שחקנים שאישרו הגעה, ${arrivedPlayers} שהגיעו. ${
            arrivedWithoutRSVPPlayers > 0
              ? arrivedWithoutRSVPPlayers > 1
                ? `(${arrivedWithoutRSVPPlayers} שחקנים הגיעו מבלי לאשר הגעה)`
                : `(שחקן אחד הגיע מבלי לאשר הגעה)`
              : ''
          }`
        : `מציג ${arrivedPlayers} שחקנים שהגיעו.`;

  const minPosition = getMinPosition(players);

  const dayOfTheWeek = getDayOfTheWeek().toLowerCase();

  const currentTournaments = tournaments.filter(
    (t) =>
      t.day.toLowerCase() === dayOfTheWeek &&
      (!tournamentId || tournamentId === t.id),
  );

  const currentTournament = currentTournaments[0];

  return (
    <>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <button
          className="pointer rounded-md border p-2 hover:bg-gray-100"
          onClick={() => {
            setQuery('');
          }}
          disabled={query.length === 0}
        >
          <Tooltip
              content="נקה שורת חיפוש"
          >
            <TrashIcon className="w-6"  color={query.length === 0 ? '#AAAAAA':undefined} cursor={query.length === 0 ? 'no-drop':undefined}/>
          </Tooltip>
        </button>
        <input
          className="rtl peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder="חיפוש שחקן"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          value={query}
        />

        <CreateNewTodayPlayerButton params={{ userId, query }} />

      </div>
      <div className="rtl mt-4 flex items-center justify-between gap-2 md:mt-8">
        <div className="full-width rtl mt-6 flow-root">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              textAlign: 'right',
            }}
          >
            {header}
          </div>

          <div className="inline-block min-w-full align-middle">
            <div className="w-full rounded-lg bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {players?.map((player: PlayerDB) => (
                  <div
                    key={player.id}
                    className="full-width w-full rounded-md bg-white"
                    style={{ marginBottom: 20, padding: 4 }}
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <Avatar
                            player={player}
                            tournamentIds={[currentTournament?.id]}
                          />
                          <div style={{ margin: '0 6px', zoom: 1.5 }}>
                            {player.name}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {player.phone_number}
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <div className="flex">
                          <OpenCreditModalButton
                            players={playersWithEnoughCredit}
                            player={player}
                            userId={userId}
                            setQuery={setQuery}
                            tournaments={tournaments}
                            tournamentId={tournamentId}
                          />
                          <AutoPlayerPayButton
                            player={player}
                            userId={userId}
                            tournaments={tournaments}
                            tournamentId={tournamentId}
                            updatePlayer={updatePlayer}
                          />
                        </div>

                        <OpenPositionModalButton
                          player={player}
                          initPosition={minPosition}
                          tournamentId={tournamentId}
                        />

                        {prizesEnabled && (
                          <OpenPrizeModalButton
                            player={player}
                            prizesInformation={prizesInformation}
                            tournamentId={tournamentId}
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex w-full items-center justify-between pt-4">
                      <div>
                        <Link href={getLink(player)}>
                          <span
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
                          </span>
                        </Link>
                        <div className="text-l font-medium">{player.notes}</div>
                      </div>
                      {player.entries > 0 && (
                        <div className="flex">
                          כניסות:
                          <EntriesButton
                            player={player}
                            updatePlayer={updatePlayer}
                          />
                        </div>
                      )}
                    </div>
                    {rsvpEnabled && isRsvpRequired && currentTournament && (
                      <div
                        style={{ marginTop: 10 }}
                        className="flex w-full items-center justify-between pt-4"
                      >
                        רישום לטורניר
                        <RSVPButton
                          player={player}
                          tournamentId={currentTournament.id!}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <table className="rtl hidden min-w-full text-gray-900 md:table">
                <thead className="rtl rounded-lg text-left text-sm font-normal ">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-5 font-medium sm:pl-6"
                      style={{ textAlign: 'right' }}
                    >
                      שם
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-5 font-medium"
                      style={{ textAlign: 'right' }}
                    >
                      טלפון
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-5 font-medium"
                      style={{ textAlign: 'right' }}
                    >
                      קרדיט
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-5 font-medium"
                      style={{ textAlign: 'right' }}
                    >
                      הערות
                    </th>
                    {rsvpEnabled && isRsvpRequired && currentTournament && (
                      <th
                        scope="col"
                        className="px-3 py-5 font-medium"
                        style={{ textAlign: 'right' }}
                      >
                        אישור הגעה
                      </th>
                    )}

                    <th
                      scope="col"
                      className="px-3 py-5 font-medium"
                      style={{ textAlign: 'right' }}
                    >
                      הגיע
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-5 font-medium"
                      style={{ textAlign: 'right' }}
                    >
                      כניסות
                    </th>

                    <th scope="col" className="px-3 py-5 font-medium"></th>

                    <th
                      scope="col"
                      className="relative py-3 pl-6 pr-3"
                      style={{ textAlign: 'right' }}
                    >
                      <span className="sr-only">עריכה</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="rtl bg-white">
                  {players?.map((player: PlayerDB) => (
                    <tr
                      key={player.id}
                      className="rtl w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="font-large flex items-center gap-3">
                          <Avatar
                            player={player}
                            tournamentIds={[currentTournament?.id]}
                          />

                          <Link href={getLink(player)}>
                            <div className="font-large">{player.name}</div>
                          </Link>
                        </div>
                      </td>
                      <td className="font-large whitespace-nowrap px-3 py-3">
                        <Link href={getLink(player)}>
                          {' '}
                          {player.phone_number}
                        </Link>
                      </td>
                      <td
                        className={`ltr whitespace-nowrap px-3 py-3`}
                        style={{
                          textAlign: 'right',
                          color: formatCurrencyColor(player.balance),
                        }}
                      >
                        <Link href={getLink(player)} className="font-large">
                          {formatCurrency(player.balance)}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <Link href={getLink(player)}>{player.notes}</Link>
                      </td>

                      {rsvpEnabled && isRsvpRequired && currentTournament && (
                        <td className="rsvp-icon pointer whitespace-nowrap px-3 py-3">
                          <RSVPButton
                            player={player}
                            tournamentId={currentTournament.id!}
                          />
                        </td>
                      )}
                      <td className="rsvp-icon whitespace-nowrap px-3 py-3 ">
                        {player.arrived === currentTournament?.id ? '✔️' : ''}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 ">
                        <EntriesButton
                          player={player}
                          updatePlayer={updatePlayer}
                        />
                      </td>

                      <td className="whitespace-nowrap px-3 py-3 ">
                        <DeletePositionButton
                          player={player}
                          prevPage={prevPage}
                        />
                      </td>

                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <div className="flex">
                            <OpenCreditModalButton
                              players={playersWithEnoughCredit}
                              player={player}
                              userId={userId}
                              setQuery={setQuery}
                              tournaments={tournaments}
                              tournamentId={tournamentId}
                            />
                            <AutoPlayerPayButton
                              updatePlayer={updatePlayer}
                              player={player}
                              userId={userId}
                              tournaments={tournaments}
                              tournamentId={tournamentId}
                            />
                          </div>

                          <OpenPositionModalButton
                            player={player}
                            initPosition={minPosition}
                            tournamentId={tournamentId}
                          />

                          {prizesEnabled && (
                            <OpenPrizeModalButton
                              player={player}
                              prizesInformation={prizesInformation}
                              tournamentId={tournamentId}
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
