import Image from 'next/image';
import { UpdatePlayer  } from '@/app/ui/players/buttons';
import {  DeletePlayer } from '@/app/ui/players/client-buttons';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredPlayers } from '@/app/lib/data';
import Link from "next/link";
import {PencilIcon} from "@heroicons/react/24/outline";

export default async function PlayersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const players = await fetchFilteredPlayers(query, currentPage);
 //console.log('### players:', players)
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {players?.map((player) => (
              <div
                key={player.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <Link href={`/dashboard/players/${player.id}/data`}>
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <Image
                          src={player.image_url}
                          className="mr-2 rounded-full zoom-on-hover"
                          width={28}
                          height={28}
                          alt={`${player.name}'s profile picture`}
                        />
                        <p>
                            {player.name}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">{player.phone_number}</p>
                    </div>
                  </div>
                </Link>

                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      balance: {formatCurrency(player.balance)}
                    </p>
                    <p className="text-l font-medium">
                      {player.notes}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdatePlayer id={player.id} />
                    <DeletePlayer id={player.id} />
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
                    <Link
                        href={`/dashboard/players/${player.id}/data`}
                    >
                    <div className="flex items-center gap-3">
                      <Image
                        src={player.image_url}
                        className="rounded-full zoom-on-hover"
                        width={28}
                        height={28}
                        alt={`${player.name}'s profile picture`}
                      />
                      <p>
                        {player.name}
                      </p>
                    </div>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Link
                        href={`/dashboard/players/${player.id}/data`}
                    >
                    {player.phone_number}
                    </Link>
                  </td>
                  <td className={`whitespace-nowrap px-3 py-3 ${player.historyCount > 1 ? 'bold':''}`}>
                    <Link
                        href={`/dashboard/players/${player.id}/data`}
                    >
                    {formatCurrency(player.balance)}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Link
                        href={`/dashboard/players/${player.id}/data`}
                    >
                    {player.notes}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Link
                        href={`/dashboard/players/${player.id}/data`}
                    >
                    {formatDateToLocal(player.updated_at)}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdatePlayer id={player.id} />
                      <DeletePlayer id={player.id} />
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
