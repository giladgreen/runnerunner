import Form from '@/app/ui/players/create-bug-form';
import {fetchAllBugs, fetchAllPlayersForExport, fetchTemplates} from "@/app/lib/data";
import {formatCurrency, formatDateToLocal} from "@/app/lib/utils";
import {ImportPlayers, ExportPlayers, ResetRSVP} from "@/app/ui/players/client-buttons";
import {PlayerDB} from "@/app/lib/definitions";
import React from "react";
import { PencilIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default async function Page() {
    const bugs = await fetchAllBugs();
    const players = await fetchAllPlayersForExport();
    const templates = await fetchTemplates();

    return (
        <div className="w-full">
            <div className="config-section">
                <b>Configurations</b>
            </div>

            <div className="config-seperator"/>

            <div className="config-section">
                <div><u><b>Import players from CSV file</b></u></div>
                <div>each line in the file should be in the form of:</div>
                <div style={{marginBottom: 15}}><b>name, phone number, balance, notes</b></div>
                <ImportPlayers/>
            </div>

            <div className="config-seperator"/>

            <div className="config-section">
                <div style={{marginBottom: 20}}><b>Export players data to CSV file</b></div>
                <ExportPlayers players={players as PlayerDB[]}/>
            </div>

            <div className="config-seperator"/>

            <div className="config-section">
                <div style={{marginBottom: 20}}><b>Reset all 🫡RSVPs</b></div>
                <ResetRSVP/>
                *should be performed at the beginning of each week
            </div>
            <div className="config-seperator"/>

            <div className="config-section">
                <div><b><u>Templates:</u></b></div>
                <table className="hidden min-w-full text-gray-900 md:table">
                    <thead className="rounded-lg text-left text-sm font-normal">
                    <tr>
                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                            Day
                        </th>
                        <th scope="col" className="px-3 py-5 font-medium">
                            Template
                        </th>
                        <th scope="col" className="px-3 py-5 font-medium">
                            Amount
                        </th>
                        <th scope="col" className="px-3 py-5 font-medium">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white">
                    {templates?.map((template) => (
                        <tr
                            key={template.id}
                            className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                        >
                            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                {template.day}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3">
                                {template.template}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3">
                                {formatCurrency(template.amount)}
                            </td>
                            <td className="whitespace-nowrap py-3 pl-6 pr-3">

                                <div className="flex justify-end gap-3">
                                    <Link
                                        href={`/dashboard/configurations/templates/${template.id}/edit`}
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

            <div className="config-seperator"/>

            <div className="config-section">
                <h1 className="text-2xl">Report a bug</h1>
                <Form/>
                <hr style={{marginTop: 20, marginBottom: 10}}/>
                <div>
                    <div>
                        <u>{bugs.length > 0 ? 'Known bugs:' : ''}</u>
                    </div>
                    <div>
                        {bugs.map((bug) => (
                            <div key={bug.id} style={{marginTop: 20}}>
                                <div>
                                    <div>
                                        reported: {formatDateToLocal(bug.updated_at)}
                                    </div>
                                    <div>
                                        {bug.description}
                                    </div>
                                </div>
                            </div>
                        ))}


                    </div>


                </div>
            </div>


        </div>
    );
}
