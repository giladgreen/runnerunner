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
                <div style={{marginBottom: 20}}><b>Reset all RSVPs</b>
                </div>
                <ResetRSVP/>
                *should be performed at the beginning of each week
            </div>
            <div className="config-seperator"/>
            <div className="config-section">

                <Link  href="/dashboard/users"
                       className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400">
                    Users permissions
                </Link>

            </div>
            <div className="config-seperator"/>
            <div className="config-section">
                <Link href="/dashboard/configurations/templates"
                      className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400">
                    Templates
                </Link>

            </div>
            <div className="config-seperator"/>


            <div className="config-section" style={{ marginTop: 130}}>
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
