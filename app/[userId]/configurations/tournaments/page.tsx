import { fetchTournaments} from "@/app/lib/data";
import {formatCurrency} from "@/app/lib/utils";
import React from "react";
import { PencilIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default async function TournamentsSetupPage({ params }: { params: { userId: string } }) {
    const tournaments = await fetchTournaments();

    return (
        <div className="config-section">
            <div><b><u>Tournaments:</u></b></div>
            <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                        Day
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                        Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                        Buy-in
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                        Re-buy
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                        Max players
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                        RSVP Required
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                        <span className="sr-only">Edit</span>
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white">
                {tournaments?.map((tournament) => (
                    <tr
                        key={tournament.id}
                        className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                            {tournament.day}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                            {tournament.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                            {formatCurrency(tournament.buy_in)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                            {formatCurrency(tournament.re_buy)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                            {tournament.max_players}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                            {tournament.rsvp_required ? 'Yes' : 'No'}
                        </td>
                        <td className="whitespace-nowrap py-3 pl-6 pr-3">

                            <div className="flex justify-end gap-3">
                                <Link
                                    href={`/${params.userId}/configurations/tournaments/${tournament.day.toLowerCase()}/edit`}
                                    className="rounded-md border p-2 hover:bg-gray-100"
                                >
                                    <PencilIcon className="w-5"/>
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
