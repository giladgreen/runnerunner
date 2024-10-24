'use client';

import Sort from '@/app/ui/sort';
import { Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';
import { Tooltip as BlackTooltip } from 'flowbite-react';
import UpdatePlayerButton from '@/app/ui/client/UpdatePlayerButton';
import DeletePlayerButton from '@/app/ui/client/DeletePlayerButton';
import { formatCurrency, formatCurrencyColor } from '@/app/lib/utils';
import Link from 'next/link';
import RSVPButton from '@/app/ui/client/RSVPButton';
import {PlayerDB, TournamentDB, TRANSLATIONS} from '@/app/lib/definitions';
import React, {useState} from 'react';
import { formatDateToLocal, getDayOfTheWeek } from '@/app/lib/clientDateUtils';
import Avatar from '@/app/ui/client/Avatar';
import {Card, Switch} from "@nextui-org/react";


export default function PlayersTable({
  userId,
  players,
  isAdmin,
  todayTournaments,
  rsvpEnabled ,
  isRsvpNotRequired
}: {
  isAdmin: boolean;
  rsvpEnabled: boolean;
  isRsvpNotRequired: boolean;
  userId: string;
  players: PlayerDB[];
  todayTournaments: TournamentDB[]
}) {
  const [tableView, setTableView] = useState(true)

  const dayOfTheWeek = getDayOfTheWeek();
  // @ts-ignore
  const dayOfTheWeekToShow = TRANSLATIONS[dayOfTheWeek];

  return (
    <div className="rtl mt-6 flow-root">
     <div className="flex only-wide-screen">
       <BlackTooltip content="תצוגת רשת"><Squares2X2Icon className="h-[18px] w-[18px]" style={{ marginTop: 5, marginRight: 6, marginLeft: 6}} /></BlackTooltip>
       <Switch
           color="default"
           size="sm"
           isSelected={tableView}
           onChange={(val: any)=>{
               console.log('onChange ' ,val.target.checked)
               setTableView(!val.target.checked)
           }}
       />
       <BlackTooltip content="טבלה"><ListBulletIcon className="h-[18px] w-[18px]" style={{ marginTop: 5, marginRight: 6, marginLeft: 6}}/></BlackTooltip>
     </div>

      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* mobile view */}
          <div className="md:hidden">
            {players?.map((player) => (
              <div
                key={player.id}
                className="players-page-card mb-2 w-full rounded-md bg-white p-4"
              >

                  <div className="flex items-center justify-between border-b pb-4 ">
                    <div>
                      <div className="mb-2 flex items-center">
                        <Link href={`/${userId}/players/${player.id}/edit`}>
                            <Avatar
                              player={player}
                              tournamentIds={todayTournaments.map((t) => t.id)}
                            />
                        </Link>
                        <div style={{ margin: '0 10px', zoom: 1.5 }}>
                          {player.name}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {player.phone_number}
                      </div>
                        {rsvpEnabled && todayTournaments.length === 1 && todayTournaments[0].rsvp_required && todayTournaments[0] && (
                            <div
                                style={{ marginTop: 10 }}
                                className="flex w-full items-center justify-between pt-4"
                            >
                                רישום לטורניר
                                <RSVPButton
                                    player={player}
                                    tournamentId={todayTournaments[0].id!}
                                />
                            </div>
                        )}
                    </div>
                  </div>


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

          {/* web view */}
          <div>
            {tableView && <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th
                    scope="col"
                    className="px-4 py-5 font-medium sm:pl-6"
                    style={{textAlign: 'right'}}
                >
                  <Sort text="שם השחקן" sortTerm="name"/>
                </th>
                <th
                    scope="col"
                    className="font-mediu px-3 py-5 "
                    style={{textAlign: 'right'}}
                >
                  <Sort text="טלפון" sortTerm="phone"/>
                </th>
                <th
                    scope="col"
                    className="px-3 py-5 font-medium "
                    title="מיון לפי קרדיט"
                    style={{textAlign: 'right'}}
                >
                  <Sort text="קרדיט" sortTerm="balance"/>
                </th>
                <th
                    scope="col"
                    className="px-3 py-5 font-medium "
                    title="מיון לפי הערות"
                    style={{textAlign: 'right'}}
                >
                  <Sort text="הערות" sortTerm="notes"/>
                </th>
                <th
                    scope="col"
                    className="px-3 py-5 font-medium "
                    title="מיון לפי תאריך עדכון"
                    style={{textAlign: 'right'}}
                >
                  <Sort text="תאריך עדכון" sortTerm="updated_at"/>
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
                                  style={{textAlign: 'right'}}
                              >
                                <div>אישור הגעה - {dayOfTheWeekToShow}</div>
                                <div>{todayTournament.name}</div>
                              </th>
                          );
                        })}

                <th
                    scope="col"
                    className="relative py-3 pl-6 pr-3"
                    style={{textAlign: 'right'}}
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
              </thead>
              <tbody className="bg-white">
              {players?.map((player) => (
                  <tr
                      key={player.id}
                      style={{textAlign: 'right'}}
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
                        <UpdatePlayerButton id={player.id} userId={userId}/>
                        {isAdmin && (
                            <DeletePlayerButton id={player.id} userId={userId}/>
                        )}
                      </div>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>}

              {!tableView && <div className="hidden min-w-full text-gray-900 md:table" style={{marginTop: 20}}>
                  <div className="gap-2 grid grid-cols-8">
                      {players.map((player: PlayerDB, index) => (
                          <Card key={index} isPressable>
                              <div className="">
                                  <Link href={`/${userId}/players/${player.id}/edit`}>
                                  <img
                                      src={player.image_url}
                                        style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 3}}
                                  />
                                  </Link>
                              </div>
                              <div className="rtl flex justify-between"
                                   style={{padding: 10, color: 'white', background: '#222222'}}>
                                  <b>{player.name.slice(0, 14)}</b>
                                  <p className="text-default-500">{formatCurrency(player.balance)}</p>

                              </div>
                          </Card>
                      ))}
                  </div>
              </div>}
          </div>

        </div>
      </div>
    </div>
  );
}
