import Image from 'next/image';
import Sort from '@/app/ui/sort';
import { UpdatePlayer  } from '@/app/ui/players/buttons';
import {  DeletePlayer } from '@/app/ui/players/client-buttons';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import {fetchFilteredPlayers, fetchTournaments} from '@/app/lib/data';
import Link from "next/link";
import RSVPButton from "@/app/ui/players/rsvp-button";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

export default async function PlayersTable({
  query,
  currentPage,
  sortBy
}: {
  query: string;
  currentPage: number;
  sortBy: string;
}) {

  const players = await fetchFilteredPlayers(query, currentPage, sortBy);
  const now = new Date();
  const dayOfTheWeek = now.toLocaleString('en-us', { weekday: 'long' });
  const tournaments = await fetchTournaments();
  const todayTournament = tournaments.find((tournament) => tournament.day === dayOfTheWeek);
  const rsvp_required = todayTournament!.rsvp_required;

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
                <Link href={`/dashboard/players/${player.id}/edit`}>
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
                        <div>
                            {player.name}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{player.phone_number}</div>
                    </div>
                  </div>
                </Link>

                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <div className="text-xl font-medium">
                      balance: {formatCurrency(player.balance)}
                    </div>
                    <div className="text-l font-medium">
                      {player.notes}
                    </div>
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
                  <Sort text="Player Name" sortTerm="name" />
                </th>
                <th scope="col" className="px-3 py-5 font-mediu ">
                  <Sort text="Phone" sortTerm="phone" />
                </th>
                <th scope="col" className="px-3 py-5 font-medium " title="Sort by Balance">
                  <Sort text="Balance" sortTerm="balance" />

                </th>
                <th scope="col" className="px-3 py-5 font-medium " title="Sort by Notes">
                  <Sort text="Notes" sortTerm="notes" />
                </th>
                <th scope="col" className="px-3 py-5 font-medium " title="Sort by Updated At">
                  <Sort text="Updated At" sortTerm="updated_at" />
                </th>
                {rsvp_required && <th scope="col" className="px-3 py-5 font-medium">
                  RSVP - {dayOfTheWeek}
                </th>}
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
                        href={`/dashboard/players/${player.id}/edit`}
                    >
                    <div className="flex items-center gap-3">
                      <Image
                        src={player.image_url}
                        className="rounded-full zoom-on-hover"
                        width={40}
                        height={40}
                        alt={`${player.name}'s profile picture`}
                      />
                      <div >
                        {player.name}
                      </div>
                    </div>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Link
                        href={`/dashboard/players/${player.id}/edit`}
                    >
                    {player.phone_number}
                    </Link>
                  </td>
                  <td className={`whitespace-nowrap px-3 py-3 ${player.historyCount > 1 ? 'bold':''}`}>
                    <Link
                        href={`/dashboard/players/${player.id}/edit`}
                    >
                    {formatCurrency(player.balance)}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Link
                        href={`/dashboard/players/${player.id}/edit`}
                    >
                    {player.notes}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Link
                        href={`/dashboard/players/${player.id}/edit`}
                    >
                    {formatDateToLocal(player.updated_at)}
                    </Link>
                  </td>
                  {rsvp_required && <td className="whitespace-nowrap px-3 py-3 rsvp-icon pointer">
                      <RSVPButton player={player} prevPage={'/dashboard/players'} />
                  </td>}
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
