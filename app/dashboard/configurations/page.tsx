import {fetchAllBugs, fetchAllPlayersForExport, fetchFinalTablePlayers} from "@/app/lib/data";
import {ImportPlayers, ExportPlayers} from "@/app/ui/players/client-buttons";
import {PlayerDB} from "@/app/lib/definitions";
import React from "react";
import Link from 'next/link';
import Form from "@/app/ui/players/create-bug-form";
import {formatDateToLocal} from "@/app/lib/utils";

function Seperator() {
    return <div className="config-seperator"/>
}

function TournamentsLink() {
    return <div className="config-section">
        <Link href="/dashboard/configurations/tournaments"
              className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400">
            Tournaments Info
        </Link>

    </div>
}

function UserPermissionsLink() {
    return <div className="config-section">

        <Link href="/dashboard/configurations/users"
              className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400">
            Users permissions
        </Link>

    </div>
}


function ExportPlayersButton({players, playersPlaces}: { players: PlayerDB[], playersPlaces: PlayerDB[] }) {
    return <div className="config-section">
        <div style={{marginBottom: 20}}><b>Export players data to CSV file</b></div>
        <ExportPlayers players={players as PlayerDB[]} playersPlaces={playersPlaces}/>
    </div>
}

function ImportPlayersButton() {
    return <div className="config-section">
        <div><u><b>Import players from CSV file</b></u></div>
        <div>each line in the file should be in the form of:</div>
        <div style={{marginBottom: 15}}><b>name, phone number, balance, notes</b></div>
        <ImportPlayers/>
    </div>
}


function ReportBugForm({bugs}: { bugs: any[] }) {
    return <div className="config-section" style={{marginTop: 130}}>
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
}


export default async function Page() {
    const bugs = await fetchAllBugs();
    const players = await fetchAllPlayersForExport();
    const playersPlaces = await fetchFinalTablePlayers();

    return (
        <div className="w-full">

            <div className="config-section">
                <b>Configurations</b>
            </div>
            <Seperator/>
            <ExportPlayersButton players={players} playersPlaces={playersPlaces}/>
            <Seperator/>
            <ImportPlayersButton/>
            <Seperator/>
            <UserPermissionsLink/>
            <Seperator/>
            <TournamentsLink/>
            <Seperator/>

            <ReportBugForm bugs={bugs}/>



        </div>
    );
}
