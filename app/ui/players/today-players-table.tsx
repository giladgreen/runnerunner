import Image from 'next/image';
import Link from "next/link";

import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchTodayPlayers} from '@/app/lib/data';
import RSVPButton from "@/app/ui/players/rsvp-button";
import OpenModalButton from "@/app/ui/players/open-modal-button";
import {DoubleTicksIcon, TickIcon} from "@/app/ui/icons";
import {TemplateDB} from "@/app/lib/definitions";
import {fetchTemplates} from "@/app/lib/actions";

export default async function TodaysPlayersTable() {
  const players = await fetchTodayPlayers();
  const templates: TemplateDB[] = (await fetchTemplates()) as TemplateDB[];
  const now = new Date();
  const dayOfTheWeek = now.toLocaleString('en-us', { weekday: 'long' });
  const rsvpPropName = `${dayOfTheWeek.toLowerCase()}_rsvp`;
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0 w-full">
          <div className="md:hidden">
            {players?.map((player) => (
              <div
                key={player.id}
                className="w-full rounded-md bg-white" style={{marginBottom:20, width: '100%'}}
              >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <Image
                          src={player.image_url}
                          className="mr-2 rounded-full zoom-on-hover"
                          width={40}
                          height={40}
                          alt={`${player.name}'s profile picture`}
                        />
                        <p>
                            {player.name}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">{player.phone_number}</p>
                    </div>
                  </div>


                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      <Link href={`/dashboard/players/${player.id}/data`}>
                      balance: {formatCurrency(player.balance)}
                      </Link>
                    </p>
                    <p className="text-l font-medium">
                      {player.notes}
                    </p>
                  </div>
                  <div>
                    <p>
                      {
                        // @ts-ignore
                          player[rsvpPropName] && !player.arrived && <TickIcon size={24}/>
                      }
                      {
                        // @ts-ignore
                          player[rsvpPropName] && player.arrived && <DoubleTicksIcon size={24}/>
                      }
                    </p>

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
                <th scope="col" className="px-3 py-5 font-medium">
                  Updated At
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  RSVP
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Arrived
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {players?.map((player) => (
                <tr
                  key={player.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">

                    <div className="flex items-center gap-3">
                      <Image
                        src={player.image_url}
                        className="rounded-full zoom-on-hover"
                        width={40}
                        height={40}
                        alt={`${player.name}'s profile picture`}
                      />
                      <p>
                        {player.name}
                      </p>
                    </div>

                  </td>
                  <td className="whitespace-nowrap px-3 py-3">

                    {player.phone_number}

                  </td>
                  <td className={`whitespace-nowrap px-3 py-3 `}>
                    <Link href={`/dashboard/players/${player.id}/data`}>
                    {formatCurrency(player.balance)}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">

                    {player.notes}

                  </td>
                  <td className="whitespace-nowrap px-3 py-3">

                    {formatDateToLocal(player.updated_at)}

                  </td>
                  <td className="whitespace-nowrap px-3 py-3 rsvp-icon pointer">
                    <RSVPButton player={player} prevPage={'/dashboard/todayplayers'} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 rsvp-icon ">
                    {player.arrived ? '✅' : ''}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                        <OpenModalButton player={player} prevPage={'/dashboard/todayplayers'} templates={templates}/>
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
